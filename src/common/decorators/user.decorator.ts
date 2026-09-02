import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../auth/auth.service';

export const CurrentUser = createParamDecorator((data, context): JwtPayload => {
  const ctx = context.switchToHttp();
  const request = ctx.getRequest<Request>();
  return request.user;
});
