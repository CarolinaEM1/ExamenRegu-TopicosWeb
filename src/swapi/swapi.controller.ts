import { Controller, Get, Param } from '@nestjs/common';
import { SwapiService } from './swapi.service';

@Controller('swapi')
export class SwapiController {
  constructor(private readonly swapiService: SwapiService) {}

  // Mapa de URLs externas (pantalla de consulta de API)
  @Get('map')
  getExternalMap() {
    return {
      films: 'https://swapi.dev/api/films/',
      people: 'https://swapi.dev/api/people/',
      planets: 'https://swapi.dev/api/planets/',
      species: 'https://swapi.dev/api/species/',
      starships: 'https://swapi.dev/api/starships/',
      vehicles: 'https://swapi.dev/api/vehicles/',
    };
  }

  // Endpoint para disparar la descarga+inserción de un recurso
  // Ej: GET /swapi/sync/films
  @Get('sync/:resource')
  async sync(@Param('resource') resource: string) {
    const validResources = [
      'films',
      'people',
      'planets',
      'species',
      'starships',
      'vehicles',
    ];

    if (!validResources.includes(resource)) {
      return { message: 'Recurso no válido' };
    }

    return this.swapiService.syncResource(resource as any);
  }
}
