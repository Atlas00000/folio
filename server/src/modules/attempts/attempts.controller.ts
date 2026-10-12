import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { AttemptsService } from './attempts.service';
import { SubmitAttemptDto } from './dto/submit-attempt.dto';

@ApiTags('attempts')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId/questions/:questionId/attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  submit(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('questionId') questionId: string,
    @Body() dto: SubmitAttemptDto,
  ) {
    return this.attemptsService.submit(user, courseId, questionId, dto);
  }

  @Get()
  listMine(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.attemptsService.listMine(user, courseId, questionId);
  }

  @Post('hint')
  hint(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.attemptsService.requestHint(user, courseId, questionId);
  }

  @Post('reveal')
  reveal(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.attemptsService.reveal(user, courseId, questionId);
  }
}
