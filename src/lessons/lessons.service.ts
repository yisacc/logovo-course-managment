import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonDocument, LessonEntity } from './lessons.schema';
import { CreateLessonInput } from './dto/create-lesson.input';
import { CourseCategoryDocument, CourseCategoryEntity } from '../course-categories/course-categories.schema';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(LessonEntity.name)
    private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(CourseCategoryEntity.name)
    private readonly categoryModel: Model<CourseCategoryDocument>
  ){}

  async create(createLessonInput: CreateLessonInput):Promise<LessonEntity> {
    const create:LessonDocument=new this.lessonModel({
      name:createLessonInput.name,
      videoLink:createLessonInput.videoLink,
      description:createLessonInput.description,
      courseCategory:createLessonInput.courseCategory,
    });
    return await create.save().then(docLesson=>{
      return this.categoryModel.findByIdAndUpdate(
        createLessonInput.courseCategory,
        { $push: { lessons: docLesson._id } },
        { new: true, useFindAndModify: false }
      )
    })
  }

  async findAll() {
    return this.lessonModel.find();
  }

  async findOne(id:String) {
    return this.lessonModel.findById(id);
  }

}
