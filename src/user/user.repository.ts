import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/infra/prisma/prisma.service';
import { RegisterRequestDto } from '../auth/dto/requests';
import { User } from '../../prisma/generated/client';
import * as argon2 from 'argon2';
import { UserWhereInput } from '../../prisma/generated/models/User';
import { FindAllRequest } from './dto/requests/find-all.request.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: RegisterRequestDto) {
    const { login, email, password, age, about } = dto;
    const passwordHash = await argon2.hash(password);
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
      where: { id, deletedAt: null },
    });
  }
  public async findOneByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email, deletedAt: null },
    });
  }
  public async findOneByLogin(login: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { login, deletedAt: null },
    });
  }
  public async findAll(pagination: FindAllRequest): Promise<User[] | null> {
    const { limit, offset, login } = pagination;
    const where: UserWhereInput = { deletedAt: null };
    if (login) where.login = { contains: login, mode: 'insensitive' };
    return this.prismaService.user.findMany({
      skip: offset,
      take: limit,
      where,
    });
  }

  public async delete(id: string) {
    await this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date(Date.now()) },
    });
    return { success: true };
  }
}
