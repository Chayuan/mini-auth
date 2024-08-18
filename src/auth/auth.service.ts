import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './login.dto';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import { TokenResponse } from './auth.interface';
import { UsersService } from 'src/users/users.service';

// You probably want a environment variable here
export const secret = 'Captain my Captain, the fearful trip is done';
export const refreshTokenSecret = 'The ship has weathered all the racks';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    await this.usersService.getUserFromEmail('azeaze');
    if (!loginDto) throw new BadRequestException();
    const { email, password } = loginDto;

    const hashedPassword = createHash('sha256')
      .update(password, 'utf-8')
      .digest('hex');

    // Here, you should fetch user from database using unique email
    const user = await this.usersService.getUserFromEmail(email);

    if (!user || user?.password !== hashedPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const accessToken = sign(
      {
        data: {
          email: user.email,
        },
      },
      secret,
      {
        expiresIn: '1d',
      },
    );

    const refreshToken = sign({}, refreshTokenSecret, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
  async register(registerDto: RegisterDto): Promise<TokenResponse> {
    if (!registerDto) throw new BadRequestException();
    const { email, password, firstName, lastName } = registerDto;

    const hashedPassword = createHash('sha256')
      .update(password, 'utf-8')
      .digest('hex');

    const user = await this.usersService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const accessToken = sign(
      {
        data: {
          email: user.email,
        },
      },
      secret,
      {
        expiresIn: '1d',
      },
    );

    const refreshToken = sign({}, refreshTokenSecret, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }
}
