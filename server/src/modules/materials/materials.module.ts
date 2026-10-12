import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { TutorModule } from '../tutor/tutor.module';
import { LocalStorageService } from './local-storage.service';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';

@Module({
  imports: [AuthModule, CoursesModule, forwardRef(() => TutorModule)],
  controllers: [MaterialsController],
  providers: [MaterialsService, LocalStorageService],
  exports: [LocalStorageService, MaterialsService],
})
export class MaterialsModule {}
