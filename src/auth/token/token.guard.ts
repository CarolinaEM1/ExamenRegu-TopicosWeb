import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Token requerido');

    const token = authHeader.replace('Bearer ', '');

    const tokenData = this.authService.validateToken(token);
    if (!tokenData) {
      throw new UnauthorizedException('Token inválido, expirado o sin peticiones');
    }

    req.user = tokenData;
    return true;
  }
}
