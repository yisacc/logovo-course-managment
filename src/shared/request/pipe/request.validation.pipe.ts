import {
    PipeTransform,
    ArgumentMetadata,
    UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import { plainToInstance } from 'class-transformer';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from '../request.constant';
import { AuthSignUpInput } from '../../../auth/dto/auth.sign-up.input';
import { AuthLoginInput } from '../../../auth/dto/auth.login.input';
import { AuthChangePasswordInput } from '../../../auth/dto/auth.change-password.input';

export class RequestValidationPipe implements PipeTransform {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService
    ) {}

    async transform(
        value: Record<string, any>,
        { metatype }: ArgumentMetadata
    ): Promise<Record<string, any>> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const classTransformer = new metatype(value);
        const request = plainToInstance(metatype, {
            ...classTransformer,
            ...value,
        });
        this.debuggerService.info('Request Data', {
            class: 'RequestValidationPipe',
            function: 'transform',
            request: request,
        });

        const rawErrors: Record<string, any>[] = await validate(request);
        if (rawErrors.length > 0) {
            this.debuggerService.error('Request Errors', {
                class: 'RequestValidationPipe',
                function: 'transform',
                errors: rawErrors,
            });

            throw new UnprocessableEntityException({
                statusCode:
                    ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                message: 'http.clientError.unprocessableEntity',
                errors: rawErrors,
            });
        }
        return request;
    }

    private toValidate(metatype: Record<string, any>): boolean {
        const types: Record<string, any>[] = [
            AuthSignUpInput,
            AuthLoginInput,
            AuthChangePasswordInput,
        ];
        return types.includes(metatype);
    }
}
