import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Se requieren email y password');
    }

    // Ahora usamos el método login() del AuthService
    const result = await this.authService.login(email, password);

    return {
      message: 'Login exitoso',
      token: result.token,
      expiresInMinutes: result.expiresInMinutes,
      remainingRequests: result.remainingRequests,
    };
  }
}
