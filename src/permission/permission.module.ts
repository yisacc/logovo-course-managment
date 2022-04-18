import { Module } from '@nestjs/common';
import { PermissionBulkService, PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { PermissionDatabaseName, PermissionEntity, PermissionSchema } from './permission.schema';

@Module({
  providers: [PermissionService,PermissionBulkService, PermissionResolver],
  exports: [PermissionService, PermissionBulkService],
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
