import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const formatPriceCLP = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);

const CartTable: React.FC = () => {
  const { items, increment, decrement, removeItem, clearCart, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center p-5 border border-2 border-secondary rounded">
        <h4 className="text-secondary mb-3">Tu carrito está vacío</h4>
        <p className="text-secondary mb-4">Agrega productos desde nuestro catálogo</p>
        <Link to="/catalogo" className="btn btn-success btn-lg">
          <i className="bi bi-shop me-2"></i>
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Total</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: 80 }}>
                    {item.imagen && (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: 70, maxWidth: 70, objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>
                    <strong>{item.nombre}</strong>
                  </td>
                  <td>{formatPriceCLP(item.precio)}</td>
                  <td style={{ width: 180 }}>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => decrement(item.id)}
                        disabled={item.cantidad <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm bg-dark text-white border-secondary text-center"
                        value={item.cantidad}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) {

                          }
                        }}
                        style={{ maxWidth: 70 }}
                      />
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => increment(item.id)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <strong>{formatPriceCLP(item.precio * item.cantidad)}</strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(item.id)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen del carrito */}
      <div className="col-12 col-md-5 col-lg-4 ms-auto mt-4">
        <div className="card border border-primary border-3 shadow-lg cart-summary-card">
          <div className="card-header bg-primary text-white py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-clipboard-check me-2"></i>
              Resumen del Pedido
            </h5>
          </div>
          <div className="card-body bg-light text-dark p-4">
            <div className="d-flex justify-content-between mb-3 fs-6">
              <span className="text-muted">Productos:</span>
              <strong className="text-dark">{totalItems}</strong>
            </div>
            <div className="d-flex justify-content-between mb-3 fs-6">
              <span className="text-muted">Subtotal:</span>
              <strong className="text-dark">{formatPriceCLP(totalPrice)}</strong>
            </div>
            <hr className="border-secondary my-3" />
            <div className="d-flex justify-content-between align-items-center mb-4 py-2 px-3 bg-success bg-opacity-10 rounded">
              <h5 className="mb-0 fw-bold text-dark">Total:</h5>
              <h4 className="mb-0 fw-bold text-success">{formatPriceCLP(totalPrice)}</h4>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-success btn-lg fw-bold py-3">
                <i className="bi bi-credit-card me-2"></i>
                Proceder al Pago
              </button>
              <button className="btn btn-outline-danger" onClick={clearCart}>
                <i className="bi bi-trash me-2"></i>
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
