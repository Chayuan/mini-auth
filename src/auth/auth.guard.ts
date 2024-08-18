import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      throw new HttpException('Server configuration exception', 500);
    }

    try {
      const accessToken = (request.headers.authorization as string).split(
        ' ',
      )[1];

      verify(accessToken, tokenSecret) as {
        data: {
          id: string;
          name: string;
        };
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
