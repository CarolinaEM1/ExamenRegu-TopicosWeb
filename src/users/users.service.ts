import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error leyendo users:', error);
      throw error;
    }

    return data;
  }

  async findByEmail(email: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error buscando usuario por email:', error);
      return null;
    }

    return data;
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error buscando usuario por id:', error);
      return null;
    }

    return data;
  }

  async updateLastLogin(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error actualizando last_login:', error);
      throw error;
    }
  }

  async updateContactData(userId: string, phone: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('users')
      .update({ phone })
      .eq('id', userId);

    if (error) {
      console.error('Error actualizando datos de contacto:', error);
      throw error;
    }
  }

  async changePassword(userId: string, passwordHash: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', userId);

    if (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }
}
