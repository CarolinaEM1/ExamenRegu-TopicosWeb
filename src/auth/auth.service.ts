import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Aquí guardamos los tokens generados
  // token → { userId, expiresAt, remainingRequests }
  private tokenStore = new Map<string, {
    userId: string;
    expiresAt: number;
    remainingRequests: number;
  }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validar credenciales
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Actualizar último acceso
    await this.usersService.updateLastLogin(user.id);

    return user;
  }

  // Login que regresa token
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Generar token JWT
    const token = this.jwtService.sign(payload);

    // Configurar expiración y límite de peticiones por token
    const EXPIRACION_MS = 15 * 60 * 1000; // 15 minutos
    const LIMITE_PETICIONES = 20; // Ejemplo, puedes cambiarlo

    this.tokenStore.set(token, {
      userId: user.id,
      expiresAt: Date.now() + EXPIRACION_MS,
      remainingRequests: LIMITE_PETICIONES,
    });

    return {
      message: 'Login exitoso',
      token,
      expiresInMinutes: 15,
      remainingRequests: LIMITE_PETICIONES,
    };
  }

  // Validación del token en cada petición
  validateToken(token: string) {
    const entry = this.tokenStore.get(token);

    if (!entry) {
      return null; // Token no existe
    }

    // Validar expiración por tiempo
    if (Date.now() > entry.expiresAt) {
      this.tokenStore.delete(token);
      return null;
    }

    // Validar límite de peticiones
    if (entry.remainingRequests <= 0) {
      this.tokenStore.delete(token);
      return null;
    }

    // Descontar petición
    entry.remainingRequests -= 1;
    this.tokenStore.set(token, entry);

    return entry;
  }
}
