import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SwapiModule } from './swapi/swapi.module';
import { ExamenApiController } from './examen-api/examen-api.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- ESTO ES LO IMPORTANTE
    }),
    UsersModule,
    AuthModule,
    SwapiModule,
  ],
  providers: [SupabaseService],
  controllers: [ExamenApiController],
})
export class AppModule {}
