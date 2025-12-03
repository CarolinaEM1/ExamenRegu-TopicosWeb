import { Controller, Get, Query } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Controller('examen/api/v1')
export class ExamenApiController {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Mapa de rutas internas (como SWAPI pero versión local)
  @Get()
  getMap() {
    return {
      films: 'http://localhost:3000/examen/api/v1/films/',
      people: 'http://localhost:3000/examen/api/v1/people/',
      planets: 'http://localhost:3000/examen/api/v1/planets/',
      species: 'http://localhost:3000/examen/api/v1/species/',
      starships: 'http://localhost:3000/examen/api/v1/starships/',
      vehicles: 'http://localhost:3000/examen/api/v1/vehicles/',
    };
  }

  // Utilidad para paginación
  private async paginatedQuery(table: string, page: number, limit: number) {
    const supabase = this.supabaseService.getClient();

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.error(`Error leyendo ${table}:`, error);
      throw error;
    }

    return {
      count,
      page: pageNum,
      results: data,
    };
  }

  // FILMS
  @Get('films')
  async getFilms(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('films', page, limit);
  }

  // PEOPLE
  @Get('people')
  async getPeople(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('people', page, limit);
  }

  // PLANETS
  @Get('planets')
  async getPlanets(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('planets', page, limit);
  }

  // SPECIES
  @Get('species')
  async getSpecies(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('species', page, limit);
  }

  // STARSHIPS
  @Get('starships')
  async getStarships(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('starships', page, limit);
  }

  // VEHICLES
  @Get('vehicles')
  async getVehicles(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paginatedQuery('vehicles', page, limit);
  }
}
