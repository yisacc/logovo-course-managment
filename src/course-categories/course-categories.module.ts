import { Module } from '@nestjs/common';
import { CourseCategoriesService } from './course-categories.service';
import { CourseCategoriesResolver } from './course-categories.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { CourseCategoryDatabaseName, CourseCategoryEntity, CourseCategorySchema } from './course-categories.schema';

@Module({
  providers: [CourseCategoriesService, CourseCategoriesResolver],
  imports:[MongooseModule.forFeature(
    [
      {
        name: CourseCategoryEntity.name,
        schema: CourseCategorySchema,
        collection: CourseCategoryDatabaseName,
      },
    ],
    DATABASE_CONNECTION_NAME
  )]
})
export class CourseCategoriesModule {}
