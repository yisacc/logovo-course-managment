import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { RoleEntity } from 'src/role/role.schema';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class UserEntity {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  @Field()
  firstName: string;

  @Prop({
    required: false,
    index: true,
    lowercase: true,
    trim: true,
  })
  @Field()
  lastName?: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
  })
  @Field()
  mobileNumber: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  @Field()
  email: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: RoleEntity.name,
  })
  @Field(() => RoleEntity)
  role: Types.ObjectId;

  @Prop({
    required: true,
  })
  @Field()
  country: number;

  @Prop({
    required: true,
  })
  @Field()
  city: number;

  @Prop({
    required: true,
  })
  @Field(() => Date)
  birthDate: Date;

  @Prop({
    required: false,
  })
  @Field()
  image?: string;

  @Prop({
    required: true,
  })
  @Field()
  password: string;

  @Prop({
    required: false,
  })
  @Field()
  about?: string;

  @Prop({
    required: true,
  })
  @Field()
  salt: string;

  @Prop({
    required: true,
    default: true,
  })
  @Field()
  isActive: boolean;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
  this.email = this.email.toLowerCase();
  this.firstName = this.email.toLowerCase();

  if (this.lastName) {
    this.lastName = this.lastName.toLowerCase();
  }
  next();
});
