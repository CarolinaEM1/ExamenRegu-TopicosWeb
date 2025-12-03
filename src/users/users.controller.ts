import { Controller, Get, Query, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

class GetUserMeQuery {
  email: string;
}

class UpdateContactDto {
  userId: string;
  phone: string;
}

class ChangePasswordDto {
  userId: string;
  newPassword: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Ya lo tenías: listar todos los usuarios (prueba de conexión)
  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  // Datos básicos del usuario (para pantalla de inicio)
  @Get('me')
  async getMe(@Query() query: GetUserMeQuery) {
    const user = await this.usersService.findByEmail(query.email);

    if (!user) {
      return { message: 'Usuario no encontrado' };
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      last_login: user.last_login,
    };
  }

  // Actualizar datos de contacto (teléfono)
  @Patch('contact')
  async updateContact(@Body() body: UpdateContactDto) {
    await this.usersService.updateContactData(body.userId, body.phone);
    return { message: 'Datos de contacto actualizados' };
  }

  // Cambio de contraseña
  @Patch('password')
  async changePassword(@Body() body: ChangePasswordDto) {
    const hash = await bcrypt.hash(body.newPassword, 10);
    await this.usersService.changePassword(body.userId, hash);
    return { message: 'Contraseña actualizada' };
  }
}
