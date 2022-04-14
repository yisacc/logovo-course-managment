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
} from 'class-validator';
import { IsPasswordStrong, IsStartWith } from 'src/shared/request/request.decorator';
import { Field, InputType } from '@nestjs/graphql';

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
    @IsOptional()
    @ValidateIf((e) => e.lastName !== '')
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    @Field()
    readonly lastName?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(14)
    @Type(() => String)
    @IsStartWith(['628'])
    @Field()
    readonly mobileNumber: string;

    @IsNotEmpty()
    @IsMongoId()
    @Field(() => String)
    readonly role: string;

    @IsNotEmpty()
    @IsPasswordStrong()
    @Field()
    readonly password: string;
}
