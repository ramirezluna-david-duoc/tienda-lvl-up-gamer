export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
}
