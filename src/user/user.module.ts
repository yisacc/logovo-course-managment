import { Module } from '@nestjs/common';
import { UserBulkService, UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { UserDatabaseName, UserEntity, UserSchema } from './user.schema';
import { UserResolver } from './user.resolver';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { RoleDatabaseName, RoleEntity, RoleSchema } from '../role/role.schema';
import { PermissionDatabaseName, PermissionEntity, PermissionSchema } from '../permission/permission.schema';

@Module({
  imports:[MongooseModule.forFeature(
    [
      {
        name: UserEntity.name,
        schema: UserSchema,
        collection: UserDatabaseName,
      },
    ],
    DATABASE_CONNECTION_NAME
  ),
    MongooseModule.forFeature(
      [
        {
          name: RoleEntity.name,
          schema: RoleSchema,
          collection: RoleDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME
    ),
    MongooseModule.forFeature(
      [
        {
          name: PermissionEntity.name,
          schema: PermissionSchema,
          collection: PermissionDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME
    ),
  ],
  exports: [UserService, UserBulkService],
  providers: [UserService, UserBulkService,UserResolver,AuthService,RoleService],
})
export class UserModule {}
