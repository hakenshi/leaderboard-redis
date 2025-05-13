import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly db: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    return await this.db.users.create({ data: createUserDto })
  }

  async findAll() {
    return await this.db.users.findMany()
  }

  async findOne(id: number) {
    return this.db.users.findFirstOrThrow({ where: { id } })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.users.update({ data: updateUserDto, where: { id: id } })
  }

  async remove(id: number) {
    return this.db.users.delete({ where: { id } });
  }
}

