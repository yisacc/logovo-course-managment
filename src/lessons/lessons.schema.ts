import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseEntity } from '../courses/courses.schema';
import { CourseCategoryEntity } from '../course-categories/course-categories.schema';


@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class LessonsEntity{
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
    index: true,
  })
  @Field()
  videoLink: string;

  @Prop({
    required: true,
    index: true,
  })
  @Field()
  description: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: CourseCategoryEntity.name,
  })
  @Field(type=>CourseCategoryEntity)
  courseCategory: Types.ObjectId;
}

export const LessonDatabaseName = 'lessons';
export const LessonSchema = SchemaFactory.createForClass(LessonsEntity);

export type LessonDocument = LessonsEntity & Document;
