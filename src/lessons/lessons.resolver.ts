import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LessonsEntity } from './lessons.schema';
import { LessonsService } from './lessons.service';
import { CreateLessonInput } from './dto/create-lesson.input';

@Resolver(() => LessonsEntity)
export class LessonsResolver {
  constructor(private readonly lessonsService: LessonsService) {}

  @Mutation(() => LessonsEntity)
  async createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput
  ):Promise<LessonsEntity> {
    return await this.lessonsService.create(createLessonInput);
  }

  @Query(() => [LessonsEntity], { name: 'lessons' })
  async findAll():Promise<LessonsEntity[]> {
    return await this.lessonsService.findAll();
  }

  @Query(() => LessonsEntity, { name: 'courseCategory' })
  async findOne(@Args('id', { type: () => String }) id: string):Promise<LessonsEntity> {
    return await this.lessonsService.findOne(id);
  }

}
