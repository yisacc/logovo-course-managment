import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { PermissionDatabaseName, PermissionEntity, PermissionSchema } from './permission.schema';

@Module({
  providers: [PermissionService, PermissionResolver],
  imports:[MongooseModule.forFeature(
    [
      {
        name: PermissionEntity.name,
        schema: PermissionSchema,
        collection: PermissionDatabaseName,
      },
    ],
    DATABASE_CONNECTION_NAME
  ),
    ]
})
export class PermissionModule {}
