import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LessonEntity } from './lessons.schema';
import { LessonsService } from './lessons.service';
import { CreateLessonInput } from './dto/create-lesson.input';

@Resolver(() => LessonEntity)
export class LessonsResolver {
  constructor(private readonly lessonsService: LessonsService) {}

  @Mutation(() => LessonEntity)
  async createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<LessonEntity> {
    return await this.lessonsService.create(createLessonInput);
  }

  @Query(() => [LessonEntity], { name: 'lessons' })
  async findAll(): Promise<LessonEntity[]> {
    return await this.lessonsService.findAll();
  }

  @Query(() => LessonEntity, { name: 'courseCategory' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<LessonEntity> {
    return await this.lessonsService.findOne(id);
  }
}
