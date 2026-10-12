import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';

@ApiTags('topics')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses/:courseId/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: CreateTopicDto,
  ) {
    return this.topicsService.create(user, courseId, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Param('courseId') courseId: string) {
    return this.topicsService.list(user, courseId);
  }

  @Get(':topicId')
  getOne(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.topicsService.getTopic(user, courseId, topicId);
  }
}
