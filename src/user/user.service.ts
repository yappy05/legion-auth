import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterRequestDto } from '../auth/dto/requests';
import { FindOneResponse } from './dto/responses/find-one.response.dto';
import { User } from '../../prisma/generated/client';
import { FindAllRequest } from './dto/requests/find-all.request.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  public async create(dto: RegisterRequestDto) {
    const [isExistEmail, isExistLogin] = await Promise.all([
      this.userRepository.findOneByEmail(dto.email),
      this.userRepository.findOneByLogin(dto.login),
    ]);

    if (isExistEmail || isExistLogin) throw new ConflictException();

    const passwordHash = await argon2.hash(dto.password);
    return this.userRepository.create({ ...dto, password: passwordHash });
  }
  public async findOne(id: string): Promise<FindOneResponse> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException();
    return this.mapPrismaUser(user);
  }
  public async findOneByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOneByLogin(login);
    if (!user) throw new NotFoundException();
    return user;
  }

  public async findAll(dto: FindAllRequest): Promise<FindOneResponse[]> {
    const users = await this.userRepository.findAll(dto);
    if (!users) throw new NotFoundException();
    if (users.length === 0) return [];
    const normolizeUsers = users.map((user) => this.mapPrismaUser(user));
    return normolizeUsers;
  }

  public async delete(id: string) {
    return this.userRepository.delete(id);
  }

  private mapPrismaUser(data: User): FindOneResponse {
    const { login, email, age, about } = data;
    return { login, email, age, about };
  }
}
