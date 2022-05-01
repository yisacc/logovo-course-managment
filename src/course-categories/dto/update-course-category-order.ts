import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCourseCategoryOrder {
  @IsNotEmpty()
  @Field()
  newOrder: string;
}
