import { IsString, IsNotEmpty } from 'class-validator';
import { IsPasswordStrong } from 'src/shared/request/request.decorator';
import { Field } from '@nestjs/graphql';

export class AuthChangePasswordInput {
    @IsNotEmpty()
    @Field(() => String)
    id: string;

    @IsPasswordStrong()
    @IsNotEmpty()
    readonly newPassword: string;

    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;
}
