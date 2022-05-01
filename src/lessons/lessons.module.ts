import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsResolver } from './lessons.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import {
  LessonDatabaseName,
  LessonSchema,
  LessonEntity,
} from './lessons.schema';
import {
  CourseCategoryDatabaseName,
  CourseCategoryEntity,
  CourseCategorySchema,
} from '../course-categories/course-categories.schema';

@Module({
  providers: [LessonsService, LessonsResolver],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: LessonEntity.name,
          schema: LessonSchema,
          collection: LessonDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    MongooseModule.forFeature(
      [
        {
          name: CourseCategoryEntity.name,
          schema: CourseCategorySchema,
          collection: CourseCategoryDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class LessonsModule {}
