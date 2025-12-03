import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapiService } from './swapi.service';
import { SwapiController } from './swapi.controller';
import { SupabaseService } from '../supabase.service';

@Module({
  imports: [HttpModule],
  controllers: [SwapiController],
  providers: [SwapiService, SupabaseService],
})
export class SwapiModule {}

