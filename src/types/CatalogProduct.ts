import { Producto } from './Producto';

export interface CatalogProduct extends Producto {
  image: string;
  detailLink: string;
  categoryLabel: string;
  price: number;
}
