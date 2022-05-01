import { UserDocument } from './user.schema';
import { IRoleDocument } from '../role/role.interface';

export interface IUserDocument extends Omit<UserDocument, 'role'> {
  role: IRoleDocument;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  mobileNumber: string;
  role: string;
  salt: string;
  country: number;
  city: number;
  about: string;
  birthDate: Date;
}

export type IUserUpdate = Pick<IUserCreate, 'firstName' | 'lastName'>;

export interface IUserCheckExist {
  email: boolean;
  mobileNumber: boolean;
}
