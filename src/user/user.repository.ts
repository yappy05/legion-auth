import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/infra/prisma/prisma.service';
import { RegisterRequest, RegisterRequestDto } from '../auth/dto/requests';
import { User } from '../../prisma/generated/client';
import * as argon2 from 'argon2';
import { UserWhereInput } from '../../prisma/generated/models/User';
import { FindAllRequest } from './dto/requests/find-all.request.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: RegisterRequest) {
    const { login, email, password: passwordHash, age, about } = dto;
    const user = await this.prismaService.user.create({
      data: {
        login,
        email,
        passwordHash,
        age,
        about,
      },
    });
    return user;
  }

  public async findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
  public async findOneByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }
  public async findOneByLogin(login: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { login },
    });
  }
  public async findAll(pagination: FindAllRequest): Promise<User[] | null> {
    const { limit, offset, login } = pagination;
    const where: UserWhereInput = {};
    if (login) where.login = { contains: login, mode: 'insensitive' };
    return this.prismaService.user.findMany({
      skip: offset,
      take: limit,
      where,
    });
  }

  public async delete(id: string) {
    // расширение превращает delete в мягкое удаление (update deletedAt = now)
    await this.prismaService.user.delete({
      where: { id },
    });
    return { success: true };
  }
}
