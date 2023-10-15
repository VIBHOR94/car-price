import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(request: Request, _response: Response, next: NextFunction) {
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }

    next();
  }
}
