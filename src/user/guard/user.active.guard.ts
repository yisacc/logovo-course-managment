import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import {
  ENUM_USER_STATUS_CODE_ERROR,
  USER_ACTIVE_META_KEY,
} from '../user.constant';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserActiveGuard implements CanActivate {
  constructor(
    @Debugger() private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      USER_ACTIVE_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!required.includes(user.isActive)) {
      this.debuggerService.error('User active error', {
        class: 'UserActiveGuard',
        function: 'canActivate',
      });

      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_ERROR,
        message: 'user.error.active',
      });
    }
    return true;
  }
}
