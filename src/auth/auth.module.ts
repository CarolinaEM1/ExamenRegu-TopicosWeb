import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SupabaseService } from '../supabase.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'SUPER_SECRETO_EXAMEN',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService],
  exports: [
    AuthService,
    JwtModule,   //  NECESARIO PARA EL TOKEN GUARD
  ],
})
export class AuthModule {}
