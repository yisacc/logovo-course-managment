import { Module } from '@nestjs/common';
import { CoreModule } from './shared/core/core.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CoursesModule } from './courses/courses.module';
import { CourseCategoriesModule } from './course-categories/course-categories.module';
import { LessonsModule } from './lessons/lessons.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    CoreModule,
    CoursesModule,
    CourseCategoriesModule,
    LessonsModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

