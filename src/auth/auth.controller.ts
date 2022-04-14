import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    Patch,
} from '@nestjs/common';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { LoggerService } from 'src/shared/logger/logger.service';
import { ENUM_LOGGER_ACTION } from 'src/shared/logger/logger.constant';
import {
    AuthJwtGuard,
    AuthRefreshJwtGuard,
    Token,
    User,
} from './auth.decorator';
import { Response } from 'src/shared/response/response.decorator';
import { IResponse } from 'src/shared/response/response.interface';
import {
    ENUM_AUTH_STATUS_CODE_ERROR,
    ENUM_AUTH_STATUS_CODE_SUCCESS,
} from './auth.constant';
import { ENUM_STATUS_CODE_ERROR } from 'src/shared/error/error.constant';
import { AuthLoginTransformer } from './transformer/auth.login.transformer';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthLoginInput } from './dto/auth.login.input';
import { IUserCheckExist, IUserDocument } from '../user/user.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../user/user.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../role/role.constant';
import { AuthChangePasswordInput } from './dto/auth.change-password.input';
import { UserDocument } from '../user/user.schema';
import { RoleService } from '../role/role.service';
import { AuthSignUpInput } from './dto/auth.sign-up.input';
import { RoleDocument } from '../role/role.schema';
import { RequestValidationPipe } from '../shared/request/pipe/request.validation.pipe';

@Controller({
    version: '1',
})
export class AuthController {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly loggerService: LoggerService
    ) {}

    @Response('auth.login', ENUM_AUTH_STATUS_CODE_SUCCESS.AUTH_LOGIN_SUCCESS)
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(
        @Body(RequestValidationPipe) body: AuthLoginInput
    ): Promise<IResponse> {
        const rememberMe: boolean = body.rememberMe ? true : false;
        const user: IUserDocument =
            await this.userService.findOne<IUserDocument>(
                {
                    email: body.email,
                },
                {
                    populate: {
                        role: true,
                        permission: true,
                    },
                }
            );

        if (!user) {
            this.debuggerService.error('Authorized error user not found', {
                class: 'AuthController',
                function: 'login',
            });

            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const validate: boolean = await this.authService.validateUser(
            body.password,
            user.password
        );

        if (!validate) {
            this.debuggerService.error('Authorized error', {
                class: 'AuthController',
                function: 'login',
            });

            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
                message: 'auth.error.passwordNotMatch',
            });
        } else if (!user.isActive) {
            this.debuggerService.error('Auth Block', {
                class: 'AuthController',
                function: 'login',
            });

            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        } else if (!user.role.isActive) {
            this.debuggerService.error('Role Block', {
                class: 'AuthController',
                function: 'login',
            });

            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const safe: AuthLoginTransformer = await this.authService.mapLogin(
            user
        );

        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(safe, rememberMe);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(safe, rememberMe, {
                loginDate: payloadAccessToken.loginDate,
                loginExpiredDate: payloadAccessToken.loginExpiredDate,
            });

        const accessToken: string = await this.authService.createAccessToken(
            payloadAccessToken
        );

        const refreshToken: string = await this.authService.createRefreshToken(
            payloadRefreshToken,
            rememberMe
        );


        await this.loggerService.info({
            action: ENUM_LOGGER_ACTION.LOGIN,
            description: `${user._id} do login`,
            user: user._id,
            tags: ['login', 'withEmail'],
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    @Response('auth.refresh')
    @AuthRefreshJwtGuard()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @User()
        { _id, rememberMe, loginDate, loginExpiredDate }: Record<string, any>,
        @Token() refreshToken: string
    ): Promise<IResponse> {
        const user: IUserDocument =
            await this.userService.findOneById<IUserDocument>(_id, {
                populate: {
                    role: true,
                    permission: true,
                },
            });

        if (!user) {
            this.debuggerService.error('Authorized error user not found', {
                class: 'AuthController',
                function: 'refresh',
            });

            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        } else if (!user.isActive) {
            this.debuggerService.error('Auth Block', {
                class: 'AuthController',
                function: 'refresh',
            });

            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        } else if (!user.role.isActive) {
            this.debuggerService.error('Role Block', {
                class: 'AuthController',
                function: 'refresh',
            });

            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }


        const safe: AuthLoginTransformer = await this.authService.mapLogin(
            user
        );
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(safe, rememberMe, {
                loginDate,
                loginExpiredDate,
            });

        const accessToken: string = await this.authService.createAccessToken(
            payloadAccessToken
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    @Response('auth.changePassword')
    @AuthJwtGuard()
    @Patch('/change-password')
    async changePassword(
        @Body(RequestValidationPipe) body: AuthChangePasswordInput,
        @User('_id') _id: string
    ): Promise<void> {
        const user: UserDocument = await this.userService.findOneById(_id);
        if (!user) {
            this.debuggerService.error('User not found', {
                class: 'AuthController',
                function: 'changePassword',
            });

            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password
        );
        if (!matchPassword) {
            this.debuggerService.error("Old password don't match", {
                class: 'AuthController',
                function: 'changePassword',
            });

            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
                message: 'auth.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password
        );
        if (newMatchPassword) {
            this.debuggerService.error(
                "New password cant't same with old password",
                {
                    class: 'AuthController',
                    function: 'changePassword',
                }
            );

            throw new BadRequestException({
                statusCode:
                    ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'auth.error.newPasswordMustDifference',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.newPassword
            );

            await this.userService.updatePassword(user._id, password);
        } catch (e) {
            this.debuggerService.error(
                'Change password error internal server error',
                {
                    class: 'AuthController',
                    function: 'changePassword',
                    error: { ...e },
                }
            );

            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }

        return;
    }
}

@Controller({
    version: '1',
})
export class AuthPublicController {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService
    ) {}

    @Response('auth.signUp')
    @Post('/sign-up')
    async signUp(
        @Body(RequestValidationPipe)
        { email, mobileNumber, ...body }: AuthSignUpInput
    ): Promise<IResponse> {
        const role: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                name: 'user',
            }
        );
        if (!role) {
            this.debuggerService.error('Role not found', {
                class: 'AuthController',
                function: 'signUp',
            });

            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        const checkExist: IUserCheckExist = await this.userService.checkExist(
            email,
            mobileNumber
        );

        if (checkExist.email && checkExist.mobileNumber) {
            this.debuggerService.error('create user exist', {
                class: 'UserController',
                function: 'create',
            });

            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
                message: 'user.error.exist',
            });
        } else if (checkExist.email) {
            this.debuggerService.error('create user exist', {
                class: 'UserController',
                function: 'create',
            });

            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (checkExist.mobileNumber) {
            this.debuggerService.error('create user exist', {
                class: 'UserController',
                function: 'create',
            });

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        }

        try {
            const password = await this.authService.createPassword(
                body.password
            );

            const create = await this.userService.create({
                firstName: body.firstName,
                lastName: body.lastName,
                email,
                mobileNumber,
                role: role._id,
                password: password.passwordHash,
                passwordExpiredDate: password.passwordExpiredDate,
                salt: password.salt,
            });

            const user: IUserDocument =
                await this.userService.findOneById<IUserDocument>(create._id, {
                    populate: {
                        role: true,
                        permission: true,
                    },
                });
            const safe: AuthLoginTransformer = await this.authService.mapLogin(
                user
            );

            const payloadAccessToken: Record<string, any> =
                await this.authService.createPayloadAccessToken(safe, false);
            const payloadRefreshToken: Record<string, any> =
                await this.authService.createPayloadRefreshToken(safe, false, {
                    loginDate: payloadAccessToken.loginDate,
                    loginExpiredDate: payloadAccessToken.loginExpiredDate,
                });

            const accessToken: string =
                await this.authService.createAccessToken(payloadAccessToken);

            const refreshToken: string =
                await this.authService.createRefreshToken(
                    payloadRefreshToken,
                    false
                );

            return {
                accessToken,
                refreshToken,
            };
        } catch (err: any) {
            this.debuggerService.error('Signup try catch', {
                class: 'AuthController',
                function: 'signUp',
                error: err,
            });

            throw new InternalServerErrorException({
                statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
                message: 'http.serverError.internalServerError',
            });
        }
    }
}
