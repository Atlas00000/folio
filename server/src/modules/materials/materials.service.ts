import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { materials, topics } from '../../../db/schema';
import type { AuthUser } from '../../common/types/auth-user';
import { AuditService } from '../audit/audit.service';
import { CoursesService } from '../courses/courses.service';
import { IndexingService } from '../tutor/indexing.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { LocalStorageService } from './local-storage.service';

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME: Record<string, string[]> = {
  pdf: ['application/pdf'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  slides: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf',
  ],
};

@Injectable()
export class MaterialsService {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly storage: LocalStorageService,
    private readonly audit: AuditService,
    @Inject(forwardRef(() => IndexingService))
    private readonly indexing: IndexingService,
  ) {}

  async createMetadata(
    actor: AuthUser,
    courseId: string,
    topicId: string,
    dto: CreateMaterialDto,
  ) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    await this.assertTopicInCourse(topicId, courseId);

    if (dto.type === 'video_link' && !dto.externalUrl) {
      throw new BadRequestException('video_link requires externalUrl');
    }

    const [row] = await db
      .insert(materials)
      .values({
        topicId,
        title: dto.title.trim(),
        type: dto.type,
        source: dto.source?.trim(),
        licence: dto.licence?.trim(),
        externalUrl: dto.externalUrl?.trim(),
        status: 'unpublished',
        version: 1,
        uploaderId: actor.id,
        storageKey:
          dto.type === 'text_summary' && dto.body
            ? await this.saveText(courseId, dto.body)
            : null,
        mimeType: dto.type === 'text_summary' ? 'text/plain' : null,
        byteSize:
          dto.type === 'text_summary' && dto.body
            ? Buffer.byteLength(dto.body, 'utf8')
            : null,
      })
      .returning();

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'material.created',
      entityType: 'material',
      entityId: row.id,
    });

    return row;
  }

  async attachFile(
    actor: AuthUser,
    courseId: string,
    materialId: string,
    file: { filename: string; mimetype: string; buffer: Buffer },
  ) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    const material = await this.getMaterialInCourse(materialId, courseId);
    if (!['pdf', 'docx', 'slides'].includes(material.type)) {
      throw new BadRequestException('This material type does not accept uploads');
    }
    if (file.buffer.length > MAX_BYTES) {
      throw new BadRequestException('File exceeds 15MB limit');
    }
    const allowed = ALLOWED_MIME[material.type] ?? [];
    if (allowed.length && !allowed.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported mime type for ${material.type}`);
    }

    const saved = await this.storage.save({
      courseId,
      originalName: file.filename,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });

    const [updated] = await db
      .update(materials)
      .set({
        storageKey: saved.storageKey,
        mimeType: file.mimetype,
        byteSize: saved.byteSize,
        version: material.version + (material.storageKey ? 1 : 0),
        updatedAt: new Date(),
      })
      .where(eq(materials.id, materialId))
      .returning();

    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'material.file_attached',
      entityType: 'material',
      entityId: materialId,
      metadata: { version: updated.version },
    });

    return updated;
  }

  async publish(actor: AuthUser, courseId: string, materialId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    const material = await this.getMaterialInCourse(materialId, courseId);
    if (
      ['pdf', 'docx', 'slides'].includes(material.type) &&
      !material.storageKey
    ) {
      throw new BadRequestException('Upload a file before publishing');
    }
    const [updated] = await db
      .update(materials)
      .set({ status: 'published', updatedAt: new Date() })
      .where(eq(materials.id, materialId))
      .returning();
    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'material.published',
      entityType: 'material',
      entityId: materialId,
    });
    await this.indexing.reindexMaterial(courseId, materialId);
    return updated;
  }

  async withdraw(actor: AuthUser, courseId: string, materialId: string) {
    await this.coursesService.requireLecturerOrOwner(actor, courseId);
    await this.getMaterialInCourse(materialId, courseId);
    const [updated] = await db
      .update(materials)
      .set({ status: 'withdrawn', updatedAt: new Date() })
      .where(eq(materials.id, materialId))
      .returning();
    await this.audit.log({
      actorId: actor.id,
      courseId,
      action: 'material.withdrawn',
      entityType: 'material',
      entityId: materialId,
    });
    await this.indexing.reindexMaterial(courseId, materialId);
    return updated;
  }

  async list(actor: AuthUser, courseId: string, topicId: string) {
    await this.coursesService.getById(actor, courseId);
    await this.assertTopicInCourse(topicId, courseId);
    const rows = await db.query.materials.findMany({
      where: eq(materials.topicId, topicId),
    });

    const enrolmentRole = await this.viewerRole(actor, courseId);
    if (enrolmentRole === 'student') {
      return rows.filter((m) => m.status === 'published');
    }
    return rows;
  }

  async download(actor: AuthUser, courseId: string, materialId: string) {
    await this.coursesService.getById(actor, courseId);
    const material = await this.getMaterialInCourse(materialId, courseId);
    const role = await this.viewerRole(actor, courseId);
    if (role === 'student' && material.status !== 'published') {
      throw new ForbiddenException('Material not published');
    }
    if (!material.storageKey) {
      throw new NotFoundException('No file attached');
    }
    const stream = this.storage.openReadStream(material.storageKey);
    if (!stream) {
      throw new NotFoundException('File missing from storage');
    }
    return { material, stream };
  }

  private async saveText(courseId: string, body: string) {
    const saved = await this.storage.save({
      courseId,
      originalName: 'summary.txt',
      buffer: Buffer.from(body, 'utf8'),
      mimeType: 'text/plain',
    });
    return saved.storageKey;
  }

  private async assertTopicInCourse(topicId: string, courseId: string) {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new NotFoundException('Topic not found in course');
    }
  }

  private async getMaterialInCourse(materialId: string, courseId: string) {
    const material = await db.query.materials.findFirst({
      where: eq(materials.id, materialId),
    });
    if (!material) {
      throw new NotFoundException('Material not found');
    }
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, material.topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      throw new ForbiddenException('Material not in this course');
    }
    return material;
  }

  private async viewerRole(actor: AuthUser, courseId: string) {
    if (actor.globalRole === 'admin') {
      return 'lecturer';
    }
    const course = await this.coursesService.getById(actor, courseId);
    return 'myRole' in course ? (course.myRole as string) : 'student';
  }
}
