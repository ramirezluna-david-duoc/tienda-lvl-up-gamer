export interface Usuario {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  user: string; // username
  region: string;
  comuna: string;
  direccion: string;
  rol?: string;
}
