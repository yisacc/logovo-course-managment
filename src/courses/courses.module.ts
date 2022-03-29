import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseDatabaseName, CourseEntity, CourseSchema } from './courses.schema';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';

@Module({
  providers: [CoursesService, CoursesResolver],
  imports:[MongooseModule.forFeature(
    [
      {
        name: CourseEntity.name,
        schema: CourseSchema,
        collection: CourseDatabaseName,
      },
    ],
    DATABASE_CONNECTION_NAME
  )]
})
export class CoursesModule {}
