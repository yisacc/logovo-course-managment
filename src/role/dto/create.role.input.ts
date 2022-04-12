import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId,
    IsBoolean,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    @Field()
    readonly name: string;

    @IsMongoId({ each: true })
    @IsNotEmpty()
    @Field(()=>String)
    readonly permissions: string[];

    @IsBoolean()
    @IsNotEmpty()
    @Field()
    readonly isAdmin: boolean;
}
