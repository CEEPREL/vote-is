import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaDB: PrismaService) {}

  // Get user by email or username
  async getUser(identifier: string): Promise<User> {
    const user = await this.prismaDB.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Get user by id
  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prismaDB.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
