import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseEntity } from '../courses/courses.schema';
import { CourseCategoryEntity } from '../course-categories/course-categories.schema';

@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class LessonEntity {
  @Field()
  _id: string;

  @Prop({
    required: true,
    unique: true,
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
}

export const LessonDatabaseName = 'lessons';
export const LessonSchema = SchemaFactory.createForClass(LessonEntity);

export type LessonDocument = LessonEntity & Document;
