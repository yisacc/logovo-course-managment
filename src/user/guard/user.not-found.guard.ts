import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import { ENUM_USER_STATUS_CODE_ERROR } from '../user.constant';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { __user }= ctx.getContext().req;

        if (!__user) {
            this.debuggerService.error('User not found', {
                class: 'UserNotFoundGuard',
                function: 'canActivate',
            });

            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        return true;
    }
}
