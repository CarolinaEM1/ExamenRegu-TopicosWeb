import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}