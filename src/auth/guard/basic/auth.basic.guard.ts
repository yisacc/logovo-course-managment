import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth.service';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../auth.constant';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class BasicGuard implements CanActivate {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    @Debugger() private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.clientId = this.configService.get<string>('auth.basicToken.clientId');
    this.clientSecret = this.configService.get<string>(
      'auth.basicToken.clientSecret',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext().req;

    const authorization: string = request.headers.authorization;

    if (!authorization) {
      this.debuggerService.error('AuthBasicGuardError', {
        class: 'BasicGuard',
        function: 'canActivate',
      });

      throw new UnauthorizedException({
        statusCode:
          ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_BASIC_TOKEN_NEEDED_ERROR,
        message: 'http.clientError.unauthorized',
      });
    }

    const clientBasicToken: string = authorization.replace('Basic ', '');
    const ourBasicToken: string = await this.authService.createBasicToken(
      this.clientId,
      this.clientSecret,
    );

    const validateBasicToken: boolean =
      await this.authService.validateBasicToken(
        clientBasicToken,
        ourBasicToken,
      );

    if (!validateBasicToken) {
      this.debuggerService.error('AuthBasicGuardError Validate Basic Token', {
        class: 'BasicGuard',
        function: 'canActivate',
      });

      throw new UnauthorizedException({
        statusCode:
          ENUM_AUTH_STATUS_CODE_ERROR.AUTH_GUARD_BASIC_TOKEN_INVALID_ERROR,
        message: 'http.clientError.unauthorized',
      });
    }

    return true;
  }
}
