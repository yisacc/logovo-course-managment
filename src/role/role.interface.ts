import { RoleDocument } from './role.schema';
import { PermissionDocument } from '../permission/permission.schema';

export interface IRoleDocument extends Omit<RoleDocument, 'permissions'> {
  permissions: PermissionDocument[];
}
