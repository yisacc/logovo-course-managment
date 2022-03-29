import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';


@Schema({ timestamps: true, versionKey: false })
@ObjectType()
export class CourseEntity{
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
}

export const CourseDatabaseName = 'courses';
export const CourseSchema = SchemaFactory.createForClass(CourseEntity);

export type CourseDocument = CourseEntity & Document;
