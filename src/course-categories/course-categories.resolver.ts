import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseCategoryEntity } from './course-categories.schema';
import { CourseCategoriesService } from './course-categories.service';
import { CreateCourseCategoryInput } from './dto/create-course-category.input';
import { UpdateCourseCategoryOrder } from './dto/update-course-category-order';

@Resolver(() => CourseCategoryEntity)
export class CourseCategoriesResolver {
  constructor(private readonly courseCategoriesService: CourseCategoriesService) {}

  @Mutation(() => CourseCategoryEntity)
  async createCourseCategory(
    @Args('createCourseCategoryInput') createCourseCategoryInput: CreateCourseCategoryInput
  ):Promise<CourseCategoryEntity> {
    return await this.courseCategoriesService.create(createCourseCategoryInput);
  }

  @Query(() => [CourseCategoryEntity], { name: 'courseCategories' })
  async findAll():Promise<CourseCategoryEntity[]> {
    return (await this.courseCategoriesService.findAll());
  }

  @Query(() => CourseCategoryEntity, { name: 'courseCategory' })
  async findOne(@Args('id', { type: () => String }) id: string):Promise<CourseCategoryEntity> {
    return await this.courseCategoriesService.findOne(id);
  }

  @Query(() => [CourseCategoryEntity], { name: 'categoriesByCourseId' })
  async findByCourseId(@Args('courseId', { type: () => String }) id: string):Promise<CourseCategoryEntity[]> {
    return await this.courseCategoriesService.findByCourseId(id);
  }
  @Mutation(() => Boolean)
  async updateOrder(
    @Args('updateCourseCategoryOrder') updateCourseCategoryOrder: UpdateCourseCategoryOrder
  ):Promise<boolean> {
    return await this.courseCategoriesService.updateOrder(updateCourseCategoryOrder);
  }
}
