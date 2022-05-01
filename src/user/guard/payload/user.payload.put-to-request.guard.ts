import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../../user.service';
import { IUserDocument } from '../../user.interface';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = GqlExecutionContext.create(context).getContext();
    const { user } = request;

    const check: IUserDocument =
      await this.userService.findOneById<IUserDocument>(user._id, {
        populate: {
          role: true,
          permission: true,
        },
      });
    request.__user = check;

    return true;
  }
}
