import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import { ENUM_PERMISSION_STATUS_CODE_ERROR, ENUM_PERMISSIONS, PERMISSION_META_KEY } from '../../permission.constant';
import { IPermission } from '../../permission.interface';

@Injectable()
export class PermissionPayloadDefaultGuard implements CanActivate {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission: ENUM_PERMISSIONS[] =
            this.reflector.getAllAndOverride<ENUM_PERMISSIONS[]>(
                PERMISSION_META_KEY,
                [context.getHandler(), context.getClass()]
            );
        if (!requiredPermission) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const { role } = user;
        const permissions: string[] = role.permissions
            .filter((val: IPermission) => val.isActive)
            .map((val: IPermission) => val.code);

        const hasPermission: boolean = requiredPermission.every((permission) =>
            permissions.includes(permission)
        );

        if (!hasPermission) {
            this.debuggerService.error('Permission not has permission', {
                class: 'PermissionDefaultGuard',
                function: 'canActivate',
            });

            throw new ForbiddenException({
                statusCode:
                    ENUM_PERMISSION_STATUS_CODE_ERROR.PERMISSION_GUARD_INVALID_ERROR,
                message: 'permission.error.forbidden',
            });
        }
        return hasPermission;
    }
}
