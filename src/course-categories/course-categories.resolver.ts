import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseCategoryEntity } from './course-categories.schema';
import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';

@Resolver(() => CourseCategoryEntity)
export class CourseCategoriesResolver {
  constructor(private readonly courseCategoriesService: CourseCategoriesService) {}

  @Mutation(() => CourseCategoryEntity)
  async createCourse(
    @Args('createCourseInput') createCourseCategoryInput: CreateCourseCategoryInput
  ):Promise<CourseCategoryEntity> {
    return await this.courseCategoriesService.create(createCourseCategoryInput);
  }

  @Query(() => [CourseCategoryEntity], { name: 'courseCategories' })
  async findAll():Promise<CourseCategoryEntity[]> {
    return await this.courseCategoriesService.findAll();
  }

  @Query(() => CourseCategoryEntity, { name: 'courseCategory' })
  async findOne(@Args('id', { type: () => String }) id: string):Promise<CourseCategoryEntity> {
    return await this.courseCategoriesService.findOne(id);
  }

}
