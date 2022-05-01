import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PermissionDocument, PermissionEntity } from './permission.schema';
import { PermissionService } from './permission.service';

@Resolver(() => PermissionEntity)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => [PermissionEntity], { name: 'permissions' })
  async list(): Promise<PermissionEntity[]> {
    return await this.permissionService.findAll();
  }

  @Query(() => PermissionEntity, { name: 'permission' })
  async get(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PermissionEntity> {
    return await this.permissionService.findOneById(id);
  }

  @Mutation(() => PermissionEntity, { name: 'inactivepermission' })
  async inactive(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PermissionEntity> {
    return await this.permissionService.inactive(id);
  }

  @Mutation(() => PermissionEntity, { name: 'activepermission' })
  async active(
    @Args('id', { type: () => String }) id: string,
  ): Promise<PermissionEntity> {
    return await this.permissionService.active(id);
  }
}
