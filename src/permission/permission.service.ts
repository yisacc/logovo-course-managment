import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPermission } from './permission.interface';
import { PermissionDocument, PermissionEntity } from './permission.schema';
import { UpdatePermissionInput } from './dto/update.permission.input';
import { DeleteResult } from 'mongodb';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionEntity.name)
    private readonly permissionModel: Model<PermissionDocument>
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: Record<string, any>
  ): Promise<PermissionDocument[]> {
    const findAll = this.permissionModel.find(find);
    if (
      options &&
      options.limit !== undefined &&
      options.skip !== undefined
    ) {
      findAll.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      findAll.sort(options.sort);
    }

    return findAll.lean();
  }

  async findOneById(_id: string): Promise<PermissionDocument> {
    return this.permissionModel.findById(_id).lean();
  }


  async create(data: IPermission): Promise<PermissionDocument> {
    const create: PermissionDocument = new this.permissionModel({
      name: data.name,
      code: data.code,
      description: data.description,
      isActive: data.isActive || true,
    });

    return create.save();
  }

  async update(
    _id: string,
    { name, description }: UpdatePermissionInput
  ): Promise<PermissionDocument> {
    const permission = await this.permissionModel.findById(_id);

    permission.name = name;
    permission.description = description;
    return permission.save();
  }


  async inactive(_id: string): Promise<PermissionDocument> {
    const permission: PermissionDocument =
      await this.permissionModel.findById(_id);

    permission.isActive = false;
    return permission.save();
  }

  async active(_id: string): Promise<PermissionDocument> {
    const permission: PermissionDocument =
      await this.permissionModel.findById(_id);

    permission.isActive = true;
    return permission.save();
  }
}

@Injectable()
export class PermissionBulkService {
  constructor(
    @InjectModel(PermissionEntity.name)
    private readonly permissionModel: Model<PermissionDocument>
  ) {}

  async createMany(data: IPermission[]): Promise<PermissionDocument[]> {
    return this.permissionModel.insertMany(
      data.map(({ isActive, code, description, name }) => ({
        code: code,
        name: name,
        description: description,
        isActive: isActive || true,
      }))
    );
  }

  async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
    return this.permissionModel.deleteMany(find);
  }
}

