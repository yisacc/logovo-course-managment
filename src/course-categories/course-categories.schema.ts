import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { LessonEntity } from '../lessons/lessons.schema';


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
    type: [MongooseSchema.Types.ObjectId],
    default:[],
    ref: LessonEntity.name,
  })
  @Field(()=>[LessonEntity] )
  lessons: MongooseSchema.Types.ObjectId[];
}

export const CourseCategoryDatabaseName = 'courseCategories';
export const CourseCategorySchema = SchemaFactory.createForClass(CourseCategoryEntity);

export type CourseCategoryDocument = CourseCategoryEntity & Document;
