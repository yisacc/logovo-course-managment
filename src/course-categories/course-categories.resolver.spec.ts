import { Test, TestingModule } from '@nestjs/testing';
import { CourseCategoriesResolver } from './course-categories.resolver';

describe('CourseCategoriesResolver', () => {
  let resolver: CourseCategoriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseCategoriesResolver],
    }).compile();

    resolver = module.get<CourseCategoriesResolver>(CourseCategoriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
