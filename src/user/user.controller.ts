import { Controller, Delete, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import {
  FindOneResponse,
  FindOneResponseDto,
} from './dto/responses/find-one.response.dto';
import { ZodResponse } from 'nestjs-zod';
import { FindAllRequestDto } from './dto/requests/find-all.request.dto';
import { DeleteResponseDto } from './dto/responses/delete.response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ZodResponse({ type: FindOneResponseDto })
  @Get('profile/me')
  public async findOne(@Req() req: Request): Promise<FindOneResponse> {
    const userProfile = await this.userService.findOne(req.user.sub);
    return userProfile;
  }

  @Get('profile/all')
  @ZodResponse({ type: [FindOneResponseDto] })
  public async findAll(@Query() query: FindAllRequestDto) {
    const { limit, offset, login } = query;
    const users = await this.userService.findAll({ limit, offset, login });
    return users;
  }

  @Delete()
  @ZodResponse({ type: DeleteResponseDto })
  public async delete(@Req() req: Request) {
    const id = req.user.sub;
    return this.userService.delete(id);
  }
}
