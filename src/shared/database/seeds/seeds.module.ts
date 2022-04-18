import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionModule } from '../../../permission/permission.module';

import { PermissionSeed } from 'src/shared/database/seeds/permission.seed';
import { RoleSeed } from './role.seed';
import { RoleModule } from '../../../role/role.module';
import { UserSeed } from './user.seed';
import { UserModule } from '../../../user/user.module';
import { AuthModule } from '../../../auth/auth.module';
import { CoreModule } from 'src/shared/core/core.module';

@Module({
    imports: [
        CoreModule,
        CommandModule,
        PermissionModule,
        UserModule,
        AuthModule,
        RoleModule,
    ],
    providers: [PermissionSeed, RoleSeed, UserSeed],
    exports: [],
})
export class SeedsModule {}
