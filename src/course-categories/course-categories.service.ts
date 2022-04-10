import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseCategoryDocument, CourseCategoryEntity } from './course-categories.schema';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { CourseDocument, CourseEntity } from '../courses/courses.schema';
import { UpdateCourseCategoryOrder } from './dto/update-course-category-order';

@Injectable()
export class CourseCategoriesService {
  constructor(
    @InjectModel(CourseCategoryEntity.name)
    private readonly courseCategoryModel: Model<CourseCategoryDocument>,
    @InjectModel(CourseEntity.name)
    private readonly courseModel: Model<CourseDocument>
  ){}

  async create(createCourseCategoryInput: CreateCourseCategoryInput):Promise<CourseCategoryEntity> {
    const course=await this.courseModel.findById(createCourseCategoryInput.course)
    const create:CourseCategoryDocument=new this.courseCategoryModel({
      name:createCourseCategoryInput.name,
      course:createCourseCategoryInput.course,
      orderKey:course.courseCategories.length,
    });
    return await create.save().then(docCategory=>
      this.courseModel.findByIdAndUpdate(createCourseCategoryInput.course,
    { $push: { courseCategories: docCategory._id } },
    { new: true, useFindAndModify: false }
    )
    )
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

  async updateOrder(updateCourseCategoryOrder: UpdateCourseCategoryOrder):Promise<CourseCategoryEntity[]> {
    const newOrder=updateCourseCategoryOrder.newOrder.split(',')
    for(let i=0;i<newOrder.length;i++){
      let data=newOrder[i]
      const update : CourseCategoryDocument =await this.courseCategoryModel.findById(data);
      update.orderKey=i;
     await update.save();
    }
return this.courseCategoryModel.find();

  }
}
