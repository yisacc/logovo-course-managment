import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    ValidateIf,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
    @IsNotEmpty()
    @Field(() => String)
    id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Type(() => String)
    @Field()
    readonly firstName: string;

    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.lastName !== '')
    @MaxLength(30)
    @Type(() => String)
    @Field()
    readonly lastName?: string;
}
