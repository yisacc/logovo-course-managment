import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, Schema as MongooseSchema } from 'mongoose';
import { PermissionEntity } from 'src/permission/permission.schema';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class RoleEntity {
  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    default: [],
    ref: PermissionEntity.name,
  })
  @Field(() => [PermissionEntity])
  permissions: Types.ObjectId[];

  @Prop({
    required: true,
    default: true,
  })
  @Field()
  isActive: boolean;

  @Prop({
    required: true,
    default: false,
  })
  @Field()
  isAdmin: boolean;
}

export const RoleDatabaseName = 'roles';
export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export type RoleDocument = RoleEntity & Document;

// Hooks
RoleSchema.pre<RoleDocument>('save', function (next) {
  this.name = this.name.toLowerCase();
  next();
});
