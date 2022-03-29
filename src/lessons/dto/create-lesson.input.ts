import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

@InputType()
export class CreateLessonInput{
  @IsNotEmpty()
  @Field()
  name:string

  @IsNotEmpty()
  @Field()
  videoLink: string;

  @IsNotEmpty()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  @Field(()=>String)
  courseCategory: MongooseSchema.Types.ObjectId;

}
