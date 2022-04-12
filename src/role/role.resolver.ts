import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleEntity } from './role.schema';
import { RoleService } from './role.service';
import { CreateLessonInput } from '../lessons/dto/create-lesson.input';
import { CreateRoleInput } from './dto/create.role.input';
import { UpdateRoleInput } from './dto/update.role.input';

@Resolver(() => RoleEntity)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => RoleEntity)
  async create(
    @Args('createRoleInput') createRoleInput: CreateRoleInput
  ):Promise<RoleEntity> {
    return await this.roleService.create(createRoleInput);
  }

  @Mutation(() => RoleEntity)
  async update(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('createRoleInput') updateRoleInput: UpdateRoleInput
  ):Promise<RoleEntity> {
    return await this.roleService.update(id,updateRoleInput);
  }

  @Query(() => [RoleEntity], { name: 'roles' })
  async list():Promise<RoleEntity[]> {
    return await this.roleService.findAll();
  }

  @Query(() => RoleEntity, { name: 'permission' })
  async get(@Args('id', { type: () => String }) id: string):Promise<RoleEntity> {
    return await this.roleService.findOneById(id);
  }

  @Mutation(() => RoleEntity)
  async inactive(@Args('id', { type: () => String }) id: string):Promise<RoleEntity> {
    return await this.roleService.inactive(id);

  }

  @Mutation(() => RoleEntity)
  async active(@Args('id', { type: () => String }) id: string):Promise<RoleEntity> {
    return await this.roleService.active(id);
  }

}
