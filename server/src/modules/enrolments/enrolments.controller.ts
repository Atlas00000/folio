import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { CsvImportCommitDto, CsvImportPreviewDto } from './dto/csv-import.dto';
import { JoinCourseDto } from './dto/join-course.dto';
import { EnrolmentsService } from './enrolments.service';

@ApiTags('enrolments')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller()
export class EnrolmentsController {
  constructor(private readonly enrolmentsService: EnrolmentsService) {}

  @Post('enrolments/join')
  join(@CurrentUser() user: AuthUser, @Body() dto: JoinCourseDto) {
    return this.enrolmentsService.joinByCode(user, dto.joinCode);
  }

  @Post('courses/:courseId/enrolments/withdraw')
  withdraw(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.enrolmentsService.withdraw(user, courseId);
  }

  @Get('courses/:courseId/enrolments')
  list(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.enrolmentsService.listForCourse(user, courseId);
  }

  @Post('courses/:courseId/enrolments/import/preview')
  previewCsv(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: CsvImportPreviewDto,
  ) {
    // lecturer check happens on commit; preview is open to course lecturers via service on commit only —
    // still require auth; validate shape only here
    void courseId;
    void user;
    return this.enrolmentsService.previewCsv(dto.csv);
  }

  @Post('courses/:courseId/enrolments/import/commit')
  commitCsv(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: CsvImportCommitDto,
  ) {
    if (dto.confirm !== true) {
      return {
        message: 'Set confirm: true after reviewing preview to commit',
      };
    }
    return this.enrolmentsService.commitCsv(user, courseId, dto.csv);
  }
}
