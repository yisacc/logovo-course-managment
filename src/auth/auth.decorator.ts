import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { AUTH_ADMIN_META_KEY } from './auth.constant';
import { BasicGuard } from './guard/basic/auth.basic.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { GqlAuthGuard } from './guard/jwt/auth.jwt.guard';
import { AuthPayloadAdminGuard } from './guard/payload/auth.payload.admin.guard';
import { AuthPayloadDefaultGuard } from './guard/payload/auth.payload.default.guard';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.payload.password-expired.guard';
import {
  ENUM_PERMISSIONS,
  PERMISSION_META_KEY,
} from '../permission/permission.constant';
import { PermissionPayloadDefaultGuard } from '../permission/guard/payload/permission.default.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

export function AuthJwtGuard(): any {
  return applyDecorators(UseGuards(GqlAuthGuard, AuthPayloadDefaultGuard));
}

export function AuthPublicJwtGuard(...permissions: ENUM_PERMISSIONS[]): any {
  return applyDecorators(
    UseGuards(
      GqlAuthGuard,
      AuthPayloadDefaultGuard,
      AuthPayloadPasswordExpiredGuard,
      AuthPayloadAdminGuard,
      PermissionPayloadDefaultGuard,
    ),
    SetMetadata(PERMISSION_META_KEY, permissions),
    SetMetadata(AUTH_ADMIN_META_KEY, [false]),
  );
}

export function AuthAdminJwtGuard(...permissions: ENUM_PERMISSIONS[]) {
  // console.log(permissions)
  return applyDecorators(
    UseGuards(
      GqlAuthGuard,
      AuthPayloadDefaultGuard,
      AuthPayloadPasswordExpiredGuard,
      AuthPayloadAdminGuard,
      PermissionPayloadDefaultGuard,
    ),
    SetMetadata(PERMISSION_META_KEY, permissions),
    SetMetadata(AUTH_ADMIN_META_KEY, [true]),
  );
}

export function AuthBasicGuard(): any {
  return applyDecorators(UseGuards(BasicGuard));
}

export function AuthRefreshJwtGuard(): any {
  return applyDecorators(UseGuards(JwtRefreshGuard));
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const context = GqlExecutionContext.create(ctx);
    const { req } = context.getContext();
    return data ? req.user[data] : req.user;
  },
);

export const Token = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const context = GqlExecutionContext.create(ctx);
    const { headers } = context.getContext().req;
    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
  },
);
