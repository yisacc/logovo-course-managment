import { Module } from '@nestjs/common';
import { UserBulkService, UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { UserDatabaseName, UserEntity, UserSchema } from './user.schema';
import { UserResolver } from './user.resolver';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { RoleDatabaseName, RoleEntity, RoleSchema } from '../role/role.schema';
import {
  PermissionDatabaseName,
  PermissionEntity,
  PermissionSchema,
} from '../permission/permission.schema';
import { CloudinaryModule } from '../shared/cloudinary/cloudinary.module';
import {
  CountryDatabaseName,
  CountryEntity,
  CountrySchema,
} from 'src/countries/countries.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserEntity.name,
          schema: UserSchema,
          collection: UserDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    MongooseModule.forFeature(
      [
        {
          name: RoleEntity.name,
          schema: RoleSchema,
          collection: RoleDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    MongooseModule.forFeature(
      [
        {
          name: PermissionEntity.name,
          schema: PermissionSchema,
          collection: PermissionDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    MongooseModule.forFeature(
      [
        {
          name: CountryEntity.name,
          schema: CountrySchema,
          collection: CountryDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    CloudinaryModule,
  ],
  exports: [UserService, UserBulkService],
  providers: [
    UserService,
    UserBulkService,
    UserResolver,
    AuthService,
    RoleService,
  ],
})
export class UserModule {}
