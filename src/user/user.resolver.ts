import {
  Body,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/shared/debugger/debugger.decorator';
import { IUserCheckExist } from './user.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from './user.constant';
import {
  GetUser,
  UserDeleteGuard,
  UserGetGuard,
  UserUpdateActiveGuard,
  UserUpdateGuard,
  UserUpdateInactiveGuard,
} from './user.decorator';
import { AuthAdminJwtGuard } from '../auth/auth.decorator';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { UserEntity } from './user.schema';
import { CreateUserInput } from './dto/create.user.input';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../role/role.constant';
import { UpdateUserInput } from './dto/update.user.input';
import { ENUM_PERMISSIONS } from '../permission/permission.constant';
import { ENUM_STATUS_CODE_ERROR } from '../shared/error/error.constant';

@Resolver(()=>UserEntity)
export class UserResolver {
  constructor(
    @Debugger() private readonly debuggerService: DebuggerService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  @Query(()=>[UserEntity], { name:'users' })
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
  async list():Promise<UserEntity[]> {
    return await this.userService.findAll();

  }

  @Query(()=>UserEntity, { name:'user' })
  @UserGetGuard()
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ)
  async get(@Args('id', { type: () => String }) id: string):Promise<UserEntity> {
    return this.userService.findOneById(id);
  }
  @Mutation(()=>UserEntity)
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_CREATE)
  async create(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    const checkExist: IUserCheckExist = await this.userService.checkExist(
      createUserInput.email,
      createUserInput.mobileNumber
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
        class: 'UserResolver',
        function: 'create',
      });

      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    } else if (checkExist.mobileNumber) {
      this.debuggerService.error('create user exist', {
        class: 'UserResolver',
        function: 'create',
      });

      throw new BadRequestException({
        statusCode:
        ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
        message: 'user.error.mobileNumberExist',
      });
    }

    const role = await this.roleService.findOneById(createUserInput.role);
    if (!role) {
      this.debuggerService.error('Role not found', {
        class: 'UserResolver',
        function: 'create',
      });

      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        message: 'role.error.notFound',
      });
    }

    try {
      const password = await this.authService.createPassword(
        createUserInput.password
      );

      return await this.userService.create({
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        email: createUserInput.email,
        mobileNumber: createUserInput.mobileNumber,
        role: createUserInput.role,
        password: password.passwordHash,
        passwordExpiredDate: password.passwordExpiredDate,
        salt: password.salt,
      });


    } catch (err: any) {
      this.debuggerService.error('create try catch', {
        class: 'UserResolver',
        function: 'create',
        error: err,
      });

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }
  }
  @Mutation(()=>Boolean, { name:'user' })
  @UserDeleteGuard()
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_DELETE)
  async delete(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    try {
      await this.userService.deleteOneById(id);
    } catch (err) {
      this.debuggerService.error('delete try catch', {
        class: 'UserResolver',
        function: 'create',
        error: err,
      });
      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return true;
  }
@Mutation(()=>UserEntity,{name:'user'})
  @UserUpdateGuard()
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
  async update(
  @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserEntity> {
    try {
      return await this.userService.updateOneById(updateUserInput.id, updateUserInput);
    } catch (err: any) {
      this.debuggerService.error('update try catch', {
        class: 'UserController',
        function: 'update',
        error: {
          ...err,
        },
      });

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

  }
  @Query(()=>UserEntity,{name:'user'})
  @UserUpdateInactiveGuard()
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
  async inactive(@Args('id', { type: () => String }) id: string): Promise<UserEntity> {
    try {
      return await this.userService.inactive(id);
    } catch (e) {
      this.debuggerService.error('User inactive server internal error', {
        class: 'UserResolver',
        function: 'inactive',
        error: { ...e },
      });

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

  }
  @Query(()=>UserEntity,{name:'user'})
  @UserUpdateActiveGuard()
  @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_UPDATE)
  async active(@Args('id', { type: () => String }) id: string): Promise<void> {
    try {
      await this.userService.active(id);
    } catch (e) {
      this.debuggerService.error('User active server internal error', {
        class: 'UserController',
        function: 'active',
        error: { ...e },
      });

      throw new InternalServerErrorException({
        statusCode: ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }
}

