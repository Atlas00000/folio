import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SessionGuard } from '../../common/guards/session.guard';
import type { AuthUser } from '../../common/types/auth-user';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(user, dto);
  }

  @Get()
  listMine(@CurrentUser() user: AuthUser) {
    return this.coursesService.listMine(user);
  }

  @Get(':courseId')
  getOne(@CurrentUser() user: AuthUser, @Param('courseId') courseId: string) {
    return this.coursesService.getById(user, courseId);
  }

  @Patch(':courseId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(user, courseId, dto);
  }
}
