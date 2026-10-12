import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';

class QuestionCsvDto {
  @ApiProperty()
  @IsString()
  csv!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  confirm?: boolean;
}

@ApiTags('questions')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('topics/:topicId/questions')
  create(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionsService.create(user, courseId, topicId, dto);
  }

  @Get('topics/:topicId/questions')
  list(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.questionsService.list(user, courseId, topicId);
  }

  @Post('questions/:questionId/publish')
  publish(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionsService.publish(user, courseId, questionId);
  }

  @Post('topics/:topicId/questions/import/preview')
  preview(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
    @Body() body: QuestionCsvDto,
  ) {
    void user;
    void courseId;
    void topicId;
    return this.questionsService.previewCsv(body.csv);
  }

  @Post('topics/:topicId/questions/import/commit')
  commit(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
    @Body() body: QuestionCsvDto,
  ) {
    if (body.confirm !== true) {
      return { message: 'Set confirm: true after preview to commit' };
    }
    return this.questionsService.commitCsv(user, courseId, topicId, body.csv);
  }
}
