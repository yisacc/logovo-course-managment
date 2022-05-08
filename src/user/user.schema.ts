import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, Schema as MongooseSchema } from 'mongoose';
import { RoleEntity } from 'src/role/role.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { CityEntity } from 'src/cities/cities.schema';
import { CountryEntity } from 'src/countries/countries.schema';

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
    type: MongooseSchema.Types.ObjectId,
    ref: CountryEntity.name,
  })
  @Field(() => CountryEntity)
  country: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: CityEntity.name,
  })
  @Field(() => CityEntity)
  city: Types.ObjectId;

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
  this.firstName = this.firstName.toLowerCase();

  this.lastName = this.lastName.toLowerCase();
  next();
});
