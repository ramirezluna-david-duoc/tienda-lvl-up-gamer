import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
// import productosData from '../data/producto.json'; // Reemplazado por datos desde API
import '../styles/ProductCatalog.css';
import { BsCart4, BsFunnelFill, BsSearch } from 'react-icons/bs';
// import { Producto } from '../types/Producto'; // ya no se usa directamente
import { api, isApiError } from '../services/api';
import { CatalogProduct } from '../types/CatalogProduct';
import { useCart } from '../context/CartContext';

// const rawProducts = productosData as Producto[];

const fallbackImage = (nombre: string) => `https://via.placeholder.com/400x400/0a0a0a/ffffff?text=${encodeURIComponent(nombre)}`;

// Webpack (CRA) context para resolver imágenes sin lanzar excepciones por rutas dinámicas
// Resolver de imagen: intenta construir una ruta estática; si falla, usa placeholder.
const resolveImage = (imgName: string | null | undefined, nombre: string) => {
  if (!imgName) return fallbackImage(nombre);
  // Normalizar posibles prefijos
  const clean = imgName.replace(/^\.\//, '').replace(/^\//, '');
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`../assets/imgs/${clean}`);
  } catch {
    return fallbackImage(nombre);
  }
};

// Estado dinámico: productos del backend transformados a CatalogProduct
const useCatalogProducts = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getProductos();
        if (!mounted) return;
        const mapped = data.map((producto) => {
          const imageUrl = resolveImage(producto.imagen, producto.nombre);
          return {
            ...producto,
            image: imageUrl,
            detailLink: `/producto/${producto.id_producto}`,
            categoryLabel: producto.categoria,
            price: producto.precio
          } as CatalogProduct;
        });
        setProducts(mapped);
        setError(null);
      } catch (e: any) {
        const msg = isApiError(e) ? e.message : 'Error cargando productos';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { products, loading, error };
};

const ALL_CATEGORIES = 'todos';

const formatPriceCLP = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);

type SvgIconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

const SearchIcon = BsSearch as unknown as SvgIconComponent;
const FilterIcon = BsFunnelFill as unknown as SvgIconComponent;
const CartIcon = BsCart4 as unknown as SvgIconComponent;

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  const { products: catalogProducts, loading, error } = useCatalogProducts();
  const { addItem } = useCart();

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(catalogProducts.map((product) => product.categoryLabel)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [catalogProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return catalogProducts.filter((product) => {
      const matchesCategory = selectedCategory === ALL_CATEGORIES || product.categoryLabel === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.nombre.toLowerCase().includes(normalizedSearch) ||
        product.descripcion.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, catalogProducts]);

  const handleApplyFilters = () => {
    console.log('Filtros aplicados (simulación):', {
      categoria: selectedCategory,
      termino: searchTerm
    });
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (product: CatalogProduct) => {
    addItem({
      id: product.id_producto,
      nombre: product.nombre,
      precio: product.price,
      imagen: product.image
    });
  };

  return (
    <>
      <section className="catalog-hero text-white">
        <div className="container h-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="display-4 fw-bold text-uppercase text-shadow">Catálogo de Productos</h1>
            <p className="lead text-secondary mb-0">
              Descubre consolas, accesorios, PC gamers, sillas y más para llevar tu setup al siguiente nivel.
            </p>
          </div>
        </div>
      </section>

      <section className="catalog-section bg-dark text-white py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-12 col-lg-4 col-xxl-3">
              <div className="card filter-card bg-dark text-white border border-3 border-primary shadow-lg p-4">
                <h4 className="text-center mb-4 text-uppercase">Filtro Avanzado</h4>

                <div className="mb-4">
                  <label htmlFor="searchInput" className="form-label">Buscar productos</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <SearchIcon />
                    </span>
                    <input
                      id="searchInput"
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="Nombre o descripción"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="categoryFilter" className="form-label">Categorías</label>
                  <select
                    id="categoryFilter"
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value={ALL_CATEGORIES}>Todas las categorías</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="btn btn-custom-verde w-100"
                  onClick={handleApplyFilters}
                >
                  <FilterIcon className="me-2" /> Aplicar filtros
                </button>
              </div>
            </div>

            <div className="col-12 col-lg-8 col-xxl-9">
              {loading && (
                <div className="p-5 text-center">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
              {error && !loading && (
                <div className="catalog-empty-state p-5 text-center border border-2 border-danger rounded-3">
                  <p className="mb-2 text-danger">{error}</p>
                  <button className="btn btn-sm btn-outline-light" onClick={() => window.location.reload()}>Reintentar</button>
                </div>
              )}
              {!loading && !error && filteredProducts.length === 0 && catalogProducts.length === 0 && (
                <div className="catalog-empty-state p-5 text-center border border-2 border-secondary rounded-3">
                  <p className="mb-0 text-secondary">Aún no hay productos cargados.</p>
                </div>
              )}
              {!loading && !error && filteredProducts.length === 0 && catalogProducts.length > 0 && (
                <div className="catalog-empty-state p-5 text-center border border-2 border-secondary rounded-3">
                  <p className="mb-0 text-secondary">No encontramos productos que coincidan con tu búsqueda.</p>
                </div>
              )}
              {!loading && !error && filteredProducts.length > 0 && (
                <div className="row g-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id_producto} className="col-sm-6 col-xl-4">
                      <div className="card product-card text-white border border-3 h-100">
                        <div className="card-header text-uppercase text-secondary small fw-semibold">
                          {product.categoryLabel}
                        </div>
                        <div className="card-body d-flex flex-column">
                          <Link to={`/producto/${product.id_producto}`} className="text-decoration-none">
                            <div className="ratio ratio-1x1 mb-3 product-image-wrapper">
                              <img src={product.image} alt={product.nombre} className="img-fluid" />
                            </div>
                          </Link>
                          <Link to={`/producto/${product.id_producto}`} className="text-decoration-none">
                            <h5 className="card-title text-white mb-2">{product.nombre}</h5>
                          </Link>
                          <p className="card-text text-secondary small flex-grow-1">
                            {product.descripcion}
                          </p>
                          <div className="card-footer product-price border border-1 text-center mt-3">
                            <span className="fw-semibold">{formatPriceCLP(product.price)}</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-custom-verde mt-3"
                            onClick={() => handleAddToCart(product)}
                          >
                            <CartIcon className="me-2" /> Agregar al carro
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCatalog;
