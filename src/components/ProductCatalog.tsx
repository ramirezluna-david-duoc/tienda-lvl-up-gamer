import React, { ChangeEvent, useMemo, useState } from 'react';
import productosData from '../data/producto.json';
import '../styles/ProductCatalog.css';
import { BsCart4, BsFunnelFill, BsSearch } from 'react-icons/bs';

interface Producto {
  id_producto: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface CatalogProduct extends Producto {
  image: string;
  detailLink: string;
  categoryLabel: string;
  price: number;
}

type ProductAsset = {
  image: string;
  detailLink?: string;
  categoryLabel?: string;
  price?: number;
};

const productAssets: Record<string, ProductAsset> = {
  JM001: {
    image: require('../assets/imgs/productos/Catan/D_NQ_NP_848189-MLA84841643141_052025-O_square.png'),
    detailLink: '#',
    categoryLabel: 'Juegos de Mesa',
    price: 29990
  },
  JM002: {
    image: require('../assets/imgs/productos/Carc/D_NQ_NP_880148-MLC89039698461_072025-O-juego-de-mesa-carcassonne-2015_square.png'),
    detailLink: '#',
    categoryLabel: 'Juegos de Mesa',
    price: 24990
  },
  AC001: {
    image: require('../assets/imgs/productos/Control/D_NQ_NP_2X_932200-MLA54147001786_032023-F_square.png'),
    detailLink: '#',
    categoryLabel: 'Accesorios',
    price: 59990
  },
  AC002: {
    image: require('../assets/imgs/productos/Auriculares/D_NQ_NP_2X_931349-MCO53148372002_012023-F_square.png'),
    detailLink: '#',
    categoryLabel: 'Accesorios',
    price: 79990
  },
  CO001: {
    image: require('../assets/imgs/productos/PlayStation 5/ps5_square.png'),
    detailLink: '#',
    categoryLabel: 'Consolas',
    price: 549990
  },
  CG001: {
    image: require('../assets/imgs/productos/PC Gamer/h7325_square.png'),
    detailLink: '#',
    categoryLabel: 'Computadores Gamers',
    price: 1299990
  },
  SG001: {
    image: require('../assets/imgs/productos/Silla/41UZRUxHa4L._AC_SL1000__square.png'),
    detailLink: '#',
    categoryLabel: 'Sillas Gamers',
    price: 349990
  },
  MS001: {
    image: require('../assets/imgs/productos/Mouse/61mpMH5TzkL._AC_SL1500__square.png'),
    detailLink: '#',
    categoryLabel: 'Mouse',
    price: 49990
  },
  MP001: {
    image: require('../assets/imgs/productos/MousePad/D_NQ_NP_711289-MLU70103676213_062023-O_square.png'),
    detailLink: '#',
    categoryLabel: 'Mousepad',
    price: 29990
  },
  PP001: {
    image: require('../assets/imgs/productos/Polera/polera_azul.png'),
    detailLink: '#',
    categoryLabel: 'Poleras y Polerones',
    price: 14990
  }
};

const rawProducts = productosData as Producto[];

const fallbackImage = (nombre: string) => `https://via.placeholder.com/400x400/0a0a0a/ffffff?text=${encodeURIComponent(nombre)}`;

const catalogProducts: CatalogProduct[] = rawProducts.map((producto) => {
  const asset = productAssets[producto.id_producto] ?? {};

  return {
    ...producto,
    image: asset.image ?? fallbackImage(producto.nombre),
    detailLink: asset.detailLink ?? '#',
    categoryLabel: asset.categoryLabel ?? producto.categoria,
    price: asset.price ?? Math.max(0, Math.round(producto.precio))
  };
});

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

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(catalogProducts.map((product) => product.categoryLabel)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return catalogProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES || product.categoryLabel === selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.nombre.toLowerCase().includes(normalizedSearch) ||
        product.descripcion.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

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
    console.log('Agregar al carrito (simulación):', {
      id: product.id_producto,
      nombre: product.nombre,
      precio: product.price
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
              {filteredProducts.length === 0 ? (
                <div className="catalog-empty-state p-5 text-center border border-2 border-secondary rounded-3">
                  <p className="mb-0 text-secondary">No encontramos productos que coincidan con tu búsqueda.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id_producto} className="col-sm-6 col-xl-4">
                      <div className="card product-card text-white border border-3 h-100">
                        <div className="card-header text-uppercase text-secondary small fw-semibold">
                          {product.categoryLabel}
                        </div>
                        <div className="card-body d-flex flex-column">
                          <div className="ratio ratio-1x1 mb-3 product-image-wrapper">
                            <img src={product.image} alt={product.nombre} className="img-fluid" />
                          </div>
                          <h5 className="card-title text-white mb-2">{product.nombre}</h5>
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
