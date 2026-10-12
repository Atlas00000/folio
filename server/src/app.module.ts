import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrolmentsModule } from './modules/enrolments/enrolments.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TopicsModule } from './modules/topics/topics.module';
import { TutorModule } from './modules/tutor/tutor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuditModule,
    AuthModule,
    CoursesModule,
    EnrolmentsModule,
    TopicsModule,
    MaterialsModule,
    QuestionsModule,
    AttemptsModule,
    ProgressModule,
    TutorModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
