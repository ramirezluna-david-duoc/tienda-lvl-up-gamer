export interface Usuario {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string; // ISO date string
  user: string; // username exposed to frontend
  region: string;
  comuna: string;
  direccion: string;
  rol: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUsuarioInput {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  user: string;
  region: string;
  comuna: string;
  direccion: string;
  password: string;
  rol?: string;
}

export interface UpdateUsuarioInput {
  nombre?: string;
  apellido?: string;
  email?: string;
  fecha_nacimiento?: string;
  user?: string; // username
  region?: string;
  comuna?: string;
  direccion?: string;
  password?: string; // new password
  rol?: string;
}
