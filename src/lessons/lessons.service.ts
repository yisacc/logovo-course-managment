import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LessonDocument, LessonsEntity } from './lessons.schema';
import { CreateLessonInput } from './dto/create-lesson.input';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(LessonsEntity.name)
    private readonly lessonModel: Model<LessonDocument>
  ){}

  async create(createLessonInput: CreateLessonInput):Promise<LessonsEntity> {
    const create:LessonDocument=new this.lessonModel({
      name:createLessonInput.name,
      videoLink:createLessonInput.videoLink,
      description:createLessonInput.description,
      courseCategory:createLessonInput.courseCategory,
    });
    return await create.save()
  }

  async findAll() {
    return this.lessonModel.find();
  }

  async findOne(id:String) {
    return this.lessonModel.findById(id);
  }

}
