import { Producto } from './Producto';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductDetail extends Producto {
  imagenes?: string[]; // Array de múltiples imágenes para el carousel
  especificaciones?: ProductSpecification[];
}
