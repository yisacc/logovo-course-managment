import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseEntity } from '../courses/courses.schema';


@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class CourseCategoryEntity{
  @Field()
  _id: string;

  @Prop({
    required: true,
    unique:true,
    index: true,
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: CourseEntity.name,
  })
  @Field(type=>CourseEntity)
  course: Types.ObjectId;
}

export const CourseCategoryDatabaseName = 'courseCategories';
export const CourseCategorySchema = SchemaFactory.createForClass(CourseCategoryEntity);

export type CourseCategoryDocument = CourseCategoryEntity & Document;
