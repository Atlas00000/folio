import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { materialChunks, materials, topics } from '../../../db/schema';
import { LocalStorageService } from '../materials/local-storage.service';
import { buildTokenWeights, chunkText } from './retrieval';

@Injectable()
export class IndexingService {
  constructor(private readonly storage: LocalStorageService) {}

  async reindexMaterial(courseId: string, materialId: string) {
    const material = await db.query.materials.findFirst({
      where: eq(materials.id, materialId),
    });
    if (!material || material.status !== 'published') {
      await db
        .delete(materialChunks)
        .where(eq(materialChunks.materialId, materialId));
      return { indexed: 0 };
    }

    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, material.topicId),
    });
    if (!topic || topic.courseId !== courseId) {
      return { indexed: 0 };
    }

    let text = '';
    if (material.storageKey && material.mimeType?.startsWith('text/')) {
      text = await this.storage.readText(material.storageKey);
    } else if (material.externalUrl) {
      text = `${material.title}. External resource: ${material.externalUrl}`;
    } else if (material.source) {
      text = `${material.title}. ${material.source}`;
    } else {
      text = material.title;
    }

    const pieces = chunkText(text);
    await db
      .delete(materialChunks)
      .where(eq(materialChunks.materialId, materialId));

    if (!pieces.length) {
      return { indexed: 0 };
    }

    await db.insert(materialChunks).values(
      pieces.map((content, idx) => ({
        courseId,
        materialId,
        materialVersion: material.version,
        title: material.title,
        locator: `section ${idx + 1}`,
        content,
        tokenWeights: buildTokenWeights(content),
      })),
    );

    return { indexed: pieces.length };
  }
}
