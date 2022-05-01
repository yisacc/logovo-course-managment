import { Exclude, Transform, Type } from 'class-transformer';
import { IRoleDocument } from '../../role/role.interface';

export class AuthLoginTransformer {
  @Type(() => String)
  readonly _id: string;

  @Transform(
    ({ value }) => ({
      name: value.name,
      permissions: value.permissions.map((val: Record<string, any>) => ({
        code: val.code,
        isActive: val.isActive,
      })),
      isActive: value.isActive,
      isAdmin: value.isAdmin,
    }),
    { toClassOnly: true },
  )
  readonly role: IRoleDocument;

  readonly email: string;
  readonly mobileNumber: string;
  readonly isActive: boolean;
  readonly passwordExpiredDate: Date;
  readonly loginExpiredDate: Date;
  readonly loginDate: Date;
  readonly rememberMe: boolean;

  @Exclude()
  readonly firstName: string;

  @Exclude()
  readonly lastName: string;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
