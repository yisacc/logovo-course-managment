import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseDocument, CourseEntity } from './courses.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { CourseCategoryEntity } from '../course-categories/course-categories.schema';
import { LessonEntity } from '../lessons/lessons.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseEntity.name)
    private readonly courseModel: Model<CourseDocument>
  ){}

  async create(createCourseInput: CreateCourseInput):Promise<CourseEntity> {
    const create:CourseDocument=new this.courseModel({
      name:createCourseInput.name,
      videoLink:createCourseInput.videoLink,
      description:createCourseInput.description
    });
    return await create.save()
  }

  async findAll() {
    return this.courseModel.find().populate({
      path:'courseCategories',
      populate:{
        path:"lessons",
        model:LessonEntity.name
      }
    });
  }

  async findOne(id:String) {
    return this.courseModel.findById(id).populate({
      path:'courseCategories',
      model:CourseCategoryEntity.name
    });
  }

}
