import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateMaterialDto } from './dto/create-material.dto';
import { MaterialsService } from './materials.service';

@ApiTags('materials')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post('topics/:topicId/materials')
  create(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
    @Body() dto: CreateMaterialDto,
  ) {
    return this.materialsService.createMetadata(user, courseId, topicId, dto);
  }

  @Get('topics/:topicId/materials')
  list(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.materialsService.list(user, courseId, topicId);
  }

  @Post('materials/:materialId/upload')
  @ApiConsumes('multipart/form-data')
  async upload(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
    @Req() req: FastifyRequest,
  ) {
    const file = await req.file();
    if (!file) {
      return { message: 'file field required' };
    }
    const buffer = await file.toBuffer();
    return this.materialsService.attachFile(user, courseId, materialId, {
      filename: file.filename,
      mimetype: file.mimetype,
      buffer,
    });
  }

  @Post('materials/:materialId/publish')
  publish(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.materialsService.publish(user, courseId, materialId);
  }

  @Post('materials/:materialId/withdraw')
  withdraw(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.materialsService.withdraw(user, courseId, materialId);
  }

  @Get('materials/:materialId/download')
  async download(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
    @Res() reply: FastifyReply,
  ) {
    const { material, stream } = await this.materialsService.download(
      user,
      courseId,
      materialId,
    );
    reply.header(
      'Content-Type',
      material.mimeType ?? 'application/octet-stream',
    );
    reply.header(
      'Content-Disposition',
      `attachment; filename="${material.title.replace(/"/g, '')}"`,
    );
    return reply.send(stream);
  }
}
