import { IsString, IsNotEmpty } from 'class-validator';
import { IsPasswordStrong } from 'src/shared/request/request.decorator';
import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export class AuthChangePasswordInput {
    @IsNotEmpty()
    @Field(() => String)
    @ApiProperty()
    id: string;

    @IsPasswordStrong()
    @IsNotEmpty()
    @ApiProperty()
    readonly newPassword: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly oldPassword: string;
}
