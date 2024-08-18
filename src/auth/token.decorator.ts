import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export interface DecodedTokenData {
  id: string;
  name: string;
  structureId: string;
}

const secret = 'Captain my Captain, the fearful trip is done';

export const DecodedToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const accessToken = (request.headers.authorization as string).split(' ')[1];

    const { data } = verify(accessToken, secret) as {
      data: {
        email: string;
      };
    };

    return data;
  },
);
