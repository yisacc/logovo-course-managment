import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsMongoId,
  IsOptional,
  ValidateIf,
  IsNumber,
  IsDate,
} from 'class-validator';
import {
  IsPasswordStrong,
  IsStartWith,
} from 'src/shared/request/request.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  @Field()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @Field()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @Field()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @Type(() => String)
  @Field()
  readonly mobileNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @Type()
  @Field()
  readonly country: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Type()
  @Field()
  readonly city: Types.ObjectId;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Field()
  readonly birthDate: Date;

  @IsString()
  @IsOptional()
  @Type(() => String)
  @Field()
  readonly about?: string;

  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  readonly role: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @Field()
  readonly password: string;
}
