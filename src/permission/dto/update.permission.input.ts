import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePermissionInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  readonly name: string;

  @IsString()
  @IsOptional()
  @ValidateIf((e) => e.description !== '')
  @Field()
  readonly description?: string;
}
