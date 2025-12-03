import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../supabase.service';

type SwapiResource =
  | 'films'
  | 'people'
  | 'planets'
  | 'species'
  | 'starships'
  | 'vehicles';

@Injectable()
export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api';

  constructor(
    private readonly http: HttpService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Obtener todas las páginas de un recurso SWAPI
  async fetchAll(resource: SwapiResource) {
    let url = `${this.baseUrl}/${resource}/`;
    const results: any[] = [];

    while (url) {
      const response = await firstValueFrom(this.http.get(url));
      const data = response.data;
      results.push(...data.results);
      url = data.next;
    }

    return results;
  }

  // Extraer ID SWAPI desde la URL
  private getSwapiIdFromUrl(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
  }

  // Sincronizar el recurso completo a Supabase
  async syncResource(resource: SwapiResource) {
    const items = await this.fetchAll(resource);
    const supabase = this.supabaseService.getClient();

    // ============================================
    // FILMS
    // ============================================
    if (resource === 'films') {
      const toInsert = items.map((film) => ({
        swapi_id: this.getSwapiIdFromUrl(film.url),
        title: film.title,
        episode_id: film.episode_id,
        director: film.director,
        release_date: film.release_date,
        raw: film,
      }));

      const { error } = await supabase
        .from('films')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'Films sincronizados correctamente' };
    }

    // ============================================
    // PEOPLE
    // ============================================
    if (resource === 'people') {
      const toInsert = items.map((person) => ({
        swapi_id: this.getSwapiIdFromUrl(person.url),
        name: person.name,
        gender: person.gender,
        birth_year: person.birth_year,
        raw: person,
      }));

      const { error } = await supabase
        .from('people')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'People sincronizados correctamente' };
    }

    // ============================================
    // PLANETS
    // ============================================
    if (resource === 'planets') {
      const toInsert = items.map((planet) => ({
        swapi_id: this.getSwapiIdFromUrl(planet.url),
        name: planet.name,
        climate: planet.climate,
        terrain: planet.terrain,
        population: planet.population,
        raw: planet,
      }));

      const { error } = await supabase
        .from('planets')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'Planets sincronizados correctamente' };
    }

    // ============================================
    // SPECIES
    // ============================================
    if (resource === 'species') {
      const toInsert = items.map((sp) => ({
        swapi_id: this.getSwapiIdFromUrl(sp.url),
        name: sp.name,
        classification: sp.classification,
        designation: sp.designation,
        language: sp.language,
        raw: sp,
      }));

      const { error } = await supabase
        .from('species')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'Species sincronizados correctamente' };
    }

    // ============================================
    // STARSHIPS
    // ============================================
    if (resource === 'starships') {
      const toInsert = items.map((ship) => ({
        swapi_id: this.getSwapiIdFromUrl(ship.url),
        name: ship.name,
        model: ship.model,
        manufacturer: ship.manufacturer,
        starship_class: ship.starship_class,
        raw: ship,
      }));

      const { error } = await supabase
        .from('starships')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'Starships sincronizados correctamente' };
    }

    // ============================================
    // VEHICLES
    // ============================================
    if (resource === 'vehicles') {
      const toInsert = items.map((veh) => ({
        swapi_id: this.getSwapiIdFromUrl(veh.url),
        name: veh.name,
        model: veh.model,
        manufacturer: veh.manufacturer,
        vehicle_class: veh.vehicle_class,
        raw: veh,
      }));

      const { error } = await supabase
        .from('vehicles')
        .upsert(toInsert, { onConflict: 'swapi_id' });

      if (error) throw error;

      return { message: 'Vehicles sincronizados correctamente' };
    }

    return { message: 'Recurso no reconocido' };
  }
}
