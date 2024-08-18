import { Injectable } from '@nestjs/common';
import { User } from './users.interface';
import { readFile, writeFile } from 'fs/promises';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor() {}

  async getUserFromEmail(email: string): Promise<User> {
    const usersDataString = await readFile(
      __dirname + '/../../users.txt',
      'utf8',
    );

    const userData: User[] = JSON.parse(usersDataString);
    return userData.find((u) => u.email === email);
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const usersDataString = await readFile(
      __dirname + '/../../users.txt',
      'utf8',
    );

    const userData: User[] = JSON.parse(usersDataString);
    userData.push(userDto);
    await writeFile(__dirname + '/../../users.txt', JSON.stringify(userData));

    return userDto;
  }
}
