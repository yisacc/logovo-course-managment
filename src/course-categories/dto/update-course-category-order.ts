import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json'
interface CategoryOrder {
  _id:string,
}

@InputType()
export class UpdateCourseCategoryOrder{
  @IsNotEmpty()
  @Field()
  newOrder:String

}
