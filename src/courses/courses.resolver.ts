import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseEntity } from './courses.schema';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';

@Resolver(() => CourseEntity)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => CourseEntity)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput
  ):Promise<CourseEntity> {
    return await this.coursesService.create(createCourseInput);
  }

  @Query(() => [CourseEntity], { name: 'courses' })
  async findAll():Promise<CourseEntity[]> {
    return await this.coursesService.findAll();
  }

  @Query(() => CourseEntity, { name: 'course' })
  async findOne(@Args('id', { type: () => String }) id: string):Promise<CourseEntity> {
    return await this.coursesService.findOne(id);
  }

}
