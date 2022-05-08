import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateIf,
  IsNumber,
  IsDate,
} from 'class-validator';
import {
  IsPasswordStrong,
  IsStartWith,
} from 'src/shared/request/request.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

export class AuthSignUpInput {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @Type(() => String)
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(14)
  @Type(() => String)
  @ApiProperty()
  readonly mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  @Field()
  @ApiProperty()
  readonly country: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  @Field()
  @ApiProperty()
  readonly city: Types.ObjectId;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Field()
  @ApiProperty()
  readonly birthDate: Date;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.about !== '')
  @Type(() => String)
  @Field()
  @ApiProperty({ required: false })
  readonly about?: string;

  @IsNotEmpty()
  @IsPasswordStrong()
  @ApiProperty()
  readonly password: string;
}
