import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/dto/responses/jwt.response.dto';

export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    context,
  ): JwtPayload | JwtPayload[keyof JwtPayload] | undefined => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
