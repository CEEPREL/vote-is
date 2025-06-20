import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';
export declare class UserService {
    private readonly prismaDB;
    constructor(prismaDB: PrismaService);
    getUser(identifier: string): Promise<User>;
    getUserById(id: string): Promise<Omit<User, 'password'>>;
    create(createUserDto: CreateUserDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
