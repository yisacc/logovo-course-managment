import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PermissionDocument } from '../permission.schema';
import { PermissionService } from '../permission.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionPutToRequestGuard implements CanActivate {
    constructor(private readonly permissionService: PermissionService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = GqlExecutionContext.create(context).getContext().req;
        const { params } = request;
        const { permission } = params;

        const check: PermissionDocument =
            await this.permissionService.findOneById(permission);
        request.__permission = check;

        return true;
    }
}
