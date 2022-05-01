import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../auth.constant';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthPayloadDefaultGuard implements CanActivate {
  constructor(@Debugger() private readonly debuggerService: DebuggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user.isActive || !user.role.isActive) {
      this.debuggerService.error('UserGuard Inactive', {
        class: 'AuthDefaultGuard',
        function: 'canActivate',
      });

      throw new ForbiddenException({
        statusCode:
          ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_JWT_ACCESS_TOKEN_ERROR,
        message: 'auth.error.blocked',
      });
    }

    return true;
  }
}
