import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseCategoryEntity } from '../course-categories/course-categories.schema';

@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class CourseEntity {
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
    type: [MongooseSchema.Types.ObjectId],
    default: [],
    ref: CourseCategoryEntity.name,
  })
  @Field(() => [CourseCategoryEntity])
  courseCategories: MongooseSchema.Types.ObjectId[];
}

export const CourseDatabaseName = 'courses';
export const CourseSchema = SchemaFactory.createForClass(CourseEntity);

export type CourseDocument = CourseEntity & Document;
