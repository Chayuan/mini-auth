import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './login.dto';
import { AuthService } from './auth.service';
import { TokenResponse } from './auth.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    // You probably want to get rid of the logs
    console.log('Login with credentials:');
    console.log(loginDto);

    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TokenResponse> {
    // You probably want to get rid of the logs
    console.log('Register with credentials:');
    console.log(registerDto);

    return await this.authService.register(registerDto);
  }
}
