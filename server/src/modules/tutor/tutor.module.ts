import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { MaterialsModule } from '../materials/materials.module';
import { IndexingService } from './indexing.service';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';

@Module({
  imports: [AuthModule, CoursesModule, forwardRef(() => MaterialsModule)],
  controllers: [TutorController],
  providers: [TutorService, IndexingService],
  exports: [IndexingService, TutorService],
})
export class TutorModule {}
