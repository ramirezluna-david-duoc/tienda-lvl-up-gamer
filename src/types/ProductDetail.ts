import { Producto } from './Producto';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductDetail extends Producto {
  imagenes?: string[];
  especificaciones?: ProductSpecification[];
}
