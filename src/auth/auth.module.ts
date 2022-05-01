import { Module } from '@nestjs/common';

import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guard/jwt/auth.jwt.strategy';
import { AuthController, AuthPublicController } from './auth.controller';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDatabaseName, UserEntity, UserSchema } from '../user/user.schema';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { RoleDatabaseName, RoleEntity, RoleSchema } from '../role/role.schema';
import { LoggerService } from '../shared/logger/logger.service';
import {
  LoggerDatabaseName,
  LoggerEntity,
  LoggerSchema,
} from '../shared/logger/logger.schema';
import { ValidatorService } from '../shared/services/validator.service';
import { CloudinaryService } from '../shared/cloudinary/cloudinary.service';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    UserService,
    RoleService,
    LoggerService,
    ValidatorService,
    CloudinaryService,
  ],
  exports: [AuthService],
  controllers: [AuthController, AuthPublicController],
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
          name: LoggerEntity.name,
          schema: LoggerSchema,
          collection: LoggerDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class AuthModule {}
