import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Helper } from 'src/shared/helper/helper.decorator';
import { DeleteResult } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { HelperService } from 'src/shared/helper/helper.service';
import {
  IUserDocument,
  IUserCreate,
  IUserUpdate,
  IUserCheckExist,
} from './user.interface';
import { UserDocument, UserEntity } from './user.schema';
import { RoleEntity } from '../role/role.schema';
import { PermissionEntity } from '../permission/permission.schema';
import { IAuthPassword } from '../auth/auth.interface';

@Injectable()
export class UserService {
  private readonly uploadPath: string;

  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    @Helper() private readonly helperService: HelperService,
    private readonly configService: ConfigService
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async findAll(
  ): Promise<UserEntity[]> {
    const users = this.userModel.find().populate({
      path: 'role',
      model: RoleEntity.name,
    });
    return users;
  }

  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.userModel.countDocuments(find);
  }


  async findOneById<T>(
    _id: string,
    options?: Record<string, any>
  ): Promise<T> {
    const user = this.userModel.findById(_id);

    if (options && options.populate && options.populate.role) {
      user.populate({
        path: 'role',
        model: RoleEntity.name,
      });

      if (options.populate.permission) {
        user.populate({
          path: 'role',
          model: RoleEntity.name,
          populate: {
            path: 'permissions',
            model: PermissionEntity.name,
          },
        });
      }
    }

    return user.lean();
  }

  async findOne<T>(
    find?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<T> {
    const user = this.userModel.findOne(find);

    if (options && options.populate && options.populate.role) {
      user.populate({
        path: 'role',
        model: RoleEntity.name,
      });

      if (options.populate.permission) {
        user.populate({
          path: 'role',
          model: RoleEntity.name,
          populate: {
            path: 'permissions',
            model: PermissionEntity.name,
          },
        });
      }
    }

    return user.lean();
  }

  async create({
                 firstName,
                 lastName,
                 password,
                 salt,
                 email,
                 mobileNumber,
                 role,
               }: IUserCreate): Promise<UserDocument> {
    const user: UserEntity = {
      firstName,
      email,
      mobileNumber,
      password,
      role: new Types.ObjectId(role),
      isActive: true,
      lastName: lastName || undefined,
      salt,
    };

    const create: UserDocument = new this.userModel(user);
    return create.save();
  }

  async deleteOneById(_id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(_id);
  }

  async deleteOne(find: Record<string, any>): Promise<UserDocument> {
    return this.userModel.findOneAndDelete(find);
  }

  async updateOneById(
    _id: string,
    { firstName, lastName }: IUserUpdate
  ): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.firstName = firstName;
    user.lastName = lastName || undefined;

    return user.save();
  }

  async checkExist(
    email: string,
    mobileNumber: string,
    _id?: string
  ): Promise<IUserCheckExist> {
    const existEmail = await this.userModel.exists({
      email: {
        $regex: new RegExp(email),
        $options: 'i',
      },
      _id: { $nin: [new Types.ObjectId(_id)] },
    });

    const existMobileNumber = await this.userModel.exists({
      mobileNumber,
      _id: { $nin: [new Types.ObjectId(_id)] },
    });

    return {
      email: !!existEmail,
      mobileNumber: !!existMobileNumber,
    };
  }


  async createRandomFilename(): Promise<Record<string, any>> {
    const filename: string = await this.helperService.stringRandom(20);

    return {
      path: this.uploadPath,
      filename: filename,
    };
  }

  async updatePassword(
    _id: string,
    { salt, passwordHash, passwordExpiredDate }: IAuthPassword
  ): Promise<UserDocument> {
    const auth: UserDocument = await this.userModel.findById(_id);

    auth.password = passwordHash;
    auth.salt = salt;

    return auth.save();
  }

  async updatePasswordExpired(
    _id: string,
    passwordExpiredDate: Date
  ): Promise<UserDocument> {
    const auth: UserDocument = await this.userModel.findById(_id);
    return auth.save();
  }

  async inactive(_id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.isActive = false;
    return user.save();
  }

  async active(_id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.isActive = true;
    return user.save();
  }
}

@Injectable()
export class UserBulkService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
    return this.userModel.deleteMany(find);
  }
}
