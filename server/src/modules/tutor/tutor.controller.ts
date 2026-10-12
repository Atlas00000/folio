import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { AskTutorDto, PreviewTutorDto } from './dto/ask-tutor.dto';
import { TutorService } from './tutor.service';

@ApiTags('tutor')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId/tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('ask')
  ask(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: AskTutorDto,
  ) {
    return this.tutorService.ask(user, courseId, dto);
  }

  @Post('preview')
  preview(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: PreviewTutorDto,
  ) {
    return this.tutorService.preview(user, courseId, dto);
  }

  @Get('flags')
  flags(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.tutorService.listFlags(user, courseId);
  }

  @Post('materials/:materialId/reindex')
  reindex(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('materialId') materialId: string,
  ) {
    return this.tutorService.reindex(user, courseId, materialId);
  }
}
