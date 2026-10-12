import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('progress/me')
  myProgress(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.myProgress(user, courseId);
  }

  @Get('analytics')
  analytics(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.courseAnalytics(user, courseId);
  }

  @Get('analytics.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="course-analytics.csv"')
  analyticsCsv(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.analyticsCsv(user, courseId);
  }
}
