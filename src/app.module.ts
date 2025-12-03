import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- ESTO ES LO IMPORTANTE
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [SupabaseService],
})
export class AppModule {}
