import { CreateRoleInput } from './create.role.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends CreateRoleInput {}
