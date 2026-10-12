import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [AuthModule, CoursesModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
