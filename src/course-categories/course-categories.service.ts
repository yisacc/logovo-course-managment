import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseCategoryDocument, CourseCategoryEntity } from './course-categories.schema';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';

@Injectable()
export class CourseCategoriesService {
  constructor(
    @InjectModel(CourseCategoryEntity.name)
    private readonly courseCategoryModel: Model<CourseCategoryDocument>
  ){}

  async create(createCourseCategoryInput: CreateCourseCategoryInput):Promise<CourseCategoryEntity> {
    const create:CourseCategoryDocument=new this.courseCategoryModel({
      name:createCourseCategoryInput.name,
      course:createCourseCategoryInput.course,
    });
    return await create.save()
  }

  async findAll() {
    return this.courseCategoryModel.find();
  }

  async findOne(id:String) {
    return this.courseCategoryModel.findById(id);
  }
  async findByCourseId(id:String):Promise<CourseCategoryDocument[]> {
    return this.courseCategoryModel.find({course:id})
  }
}
