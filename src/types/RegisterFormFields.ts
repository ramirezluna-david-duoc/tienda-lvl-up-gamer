export interface RegisterFormFields {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  usuario: string; // username
  contrasena: string;
  confirmarContrasena: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  telefono: string;
  region: string;
  comuna: string;
  direccion: string;
  referido: string;
  terminos: boolean;
}
