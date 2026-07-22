import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShoppingCart, Search, X, Info, CreditCard } from 'lucide-react';
import { getDbProducts } from '../firebase';
import './Store.css';

const categories = [
  "Todos", "Gamer", "Oficina", "Hogar", "Notebooks", "Escritorio", "All in one",
  "Componentes", "Periféricos", "Monitores", "Teclados", "Parlantes", "Combos actualización"
];

const formatPrice = (price) => Number(price).toLocaleString('es-AR');

const Store = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeBrand, setActiveBrand] = useState("Todos");
  const [activeRam, setActiveRam] = useState("Todos");
  const [activeCondition, setActiveCondition] = useState("Todos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState({ category: true, brand: true, ram: true, condition: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [dolarBlue, setDolarBlue] = useState(null);
  
  // State for the selected product modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getDbProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDolar = async () => {
      try {
        const res = await fetch("https://dolarapi.com/v1/dolares/blue");
        const data = await res.json();
        setDolarBlue(data.venta);
      } catch (err) {
        console.error("Error fetching dolar blue:", err);
      }
    };

    loadProducts();
    fetchDolar();
  }, []);

  // Dynamic filter lists
  const availableBrands = ["Todos", ...new Set(products.filter(p => p.brand).map(p => p.brand))];
  const availableRams = ["Todos", ...new Set(products.filter(p => p.ram).map(p => p.ram))];
  const availableConditions = ["Todos", ...new Set(products.filter(p => p.condition).map(p => p.condition))];

  const toggleFilter = (key) => setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));

  // Reset all filters
  const handleClearFilters = () => {
    setActiveCategory("Todos");
    setActiveBrand("Todos");
    setActiveRam("Todos");
    setActiveCondition("Todos");
    setSearchTerm("");
    setSortBy("default");
  };

  // Filter & Sort logic
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesBrand = activeBrand === "Todos" || product.brand === activeBrand;
      const matchesRam = activeRam === "Todos" || product.ram === activeRam;
      const matchesCondition = activeCondition === "Todos" || product.condition === activeCondition;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesBrand && matchesRam && matchesCondition && matchesSearch;
    })
    .sort((a, b) => {
      const getPriceInArs = (p) => {
        let price = p.hasDiscount ? p.discountPrice : p.price;
        if (p.currency === 'USD' && dolarBlue) {
          price = price * dolarBlue;
        }
        return price;
      };

      if (sortBy === "price-asc") {
        return getPriceInArs(a) - getPriceInArs(b);
      }
      if (sortBy === "price-desc") {
        return getPriceInArs(b) - getPriceInArs(a);
      }
      return 0; // Relevance / Default
    });

  return (
    <>
      <Helmet>
        <title>Tienda de Componentes y PCs | Reparo Tu Compu</title>
        <meta name="description" content="Catálogo de PCs nuevas, usadas y gamers, componentes y periféricos con especificaciones técnicas detalladas. Precíos actualizados en Buenos Aires." />
        <link rel="canonical" href="https://reparotucompu.com.ar/tienda" />
        <meta property="og:title" content="Tienda de Componentes y PCs | Reparo Tu Compu" />
        <meta property="og:description" content="PCs nuevas, usadas y gamers, componentes y periféricos. Presupuesto instantáneo en Buenos Aires." />
        <meta property="og:url" content="https://reparotucompu.com.ar/tienda" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="store-layout container">
        
        {/* Categories Sidebar */}
        <aside className={`store-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filtros</h3>
            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
          </div>
          
          <div className="filter-section">
            <h4 onClick={() => toggleFilter('category')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              Categoría <span>{openFilters.category ? '−' : '+'}</span>
            </h4>
            {openFilters.category && (
              <ul className="category-list">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <button 
                      className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => { setActiveCategory(cat); setIsSidebarOpen(false); }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {availableBrands.length > 1 && (
            <div className="filter-section" style={{ marginTop: '1.5rem' }}>
              <h4 onClick={() => toggleFilter('brand')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                Marca <span>{openFilters.brand ? '−' : '+'}</span>
              </h4>
              {openFilters.brand && (
                <ul className="category-list">
                  {availableBrands.map((b, index) => (
                    <li key={index}>
                      <button 
                        className={`category-btn ${activeBrand === b ? 'active' : ''}`}
                        onClick={() => { setActiveBrand(b); setIsSidebarOpen(false); }}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {availableRams.length > 1 && (
            <div className="filter-section" style={{ marginTop: '1.5rem' }}>
              <h4 onClick={() => toggleFilter('ram')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                Memoria RAM <span>{openFilters.ram ? '−' : '+'}</span>
              </h4>
              {openFilters.ram && (
                <ul className="category-list">
                  {availableRams.map((r, index) => (
                    <li key={index}>
                      <button 
                        className={`category-btn ${activeRam === r ? 'active' : ''}`}
                        onClick={() => { setActiveRam(r); setIsSidebarOpen(false); }}
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {availableConditions.length > 1 && (
            <div className="filter-section" style={{ marginTop: '1.5rem' }}>
              <h4 onClick={() => toggleFilter('condition')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                Condición <span>{openFilters.condition ? '−' : '+'}</span>
              </h4>
              {openFilters.condition && (
                <ul className="category-list">
                  {availableConditions.map((c, index) => (
                    <li key={index}>
                      <button 
                        className={`category-btn ${activeCondition === c ? 'active' : ''}`}
                        onClick={() => { setActiveCondition(c); setIsSidebarOpen(false); }}
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="store-main">
          
          {/* Header */}
          <div className="store-header" style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2>Tienda Online</h2>
              {dolarBlue && (
                <div style={{ fontSize: '0.85em', color: 'var(--color-primary)', marginTop: '4px', fontWeight: 'bold' }}>
                  Cotización Dólar Blue: ${formatPrice(dolarBlue)}
                </div>
              )}
            </div>
            <button className="filter-btn" onClick={() => setIsSidebarOpen(true)}>
              <Filter size={18} /> Categorías
            </button>
          </div>

          {/* Search, Sort and Filter controls */}
          <div className="store-controls-row">
            <div className="store-search-bar">
              <Search size={18} className="search-bar-icon" />
              <input 
                type="text" 
                placeholder="Buscar en el catálogo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm("")}>×</button>
              )}
            </div>
            
            <div className="store-sort-select">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Info results status */}
          <div className="store-results-info">
            <span className="results-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </span>
            {(activeCategory !== "Todos" || activeBrand !== "Todos" || activeRam !== "Todos" || activeCondition !== "Todos" || searchTerm || sortBy !== "default") && (
              <button className="clear-filters-link" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-5"
              style={{ color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div className="loading-spinner"></div>
              <p>Cargando catálogo de productos...</p>
            </motion.div>
          ) : (
            <>
              <motion.div layout className="products-grid">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="product-card"
                      onClick={() => setSelectedProduct(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="product-image" style={{ position: 'relative' }}>
                        <img src={product.img} alt={product.name} style={!product.inStock ? { opacity: 0.6 } : {}} />
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end', zIndex: 10 }}>
                          {!product.inStock && (
                            <div style={{ background: 'var(--color-danger, #e74c3c)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>
                              Consultar stock
                            </div>
                          )}
                          {product.condition && product.condition.toLowerCase() === 'usado' && (
                            <div style={{ background: 'var(--color-warning, #f39c12)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>
                              Usado
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h4>{product.name}</h4>
                        <p className="product-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          {product.hasDiscount ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85em', lineHeight: '1', marginBottom: '2px' }}>
                                {product.currency === 'USD' ? 'U$D' : '$'} {formatPrice(product.price)}
                              </span>
                              <strong style={{ color: 'var(--color-primary)', lineHeight: '1.2' }}>
                                {product.currency === 'USD' ? 'U$D' : '$'} {formatPrice(product.discountPrice)}
                              </strong>
                            </>
                          ) : (
                            <>{product.currency === 'USD' ? 'U$D' : '$'} {formatPrice(product.price)}</>
                          )}
                        </p>
                        {product.hasExtra && (
                          <div className="product-extra-tag" style={{ fontSize: '0.85em', color: 'var(--color-secondary)', marginTop: '4px' }}>
                            {product.extraName} {product.currency === 'USD' ? 'U$D' : '$'} {formatPrice(product.extraPrice)}
                          </div>
                        )}
                        <Link 
                          to="/cotizacion" 
                          state={{ 
                            selectType: 'venta', 
                            customMessage: `Hola! Me interesa consultar por el producto: ${product.name} (Precio: ${product.currency === 'USD' ? 'U$D' : '$'} ${product.hasDiscount ? formatPrice(product.discountPrice) : formatPrice(product.price)}).\nQuisiera saber sobre el stock y formas de pago.` 
                          }} 
                          className={`btn ${!product.inStock ? 'btn-outline' : 'btn-primary'} w-100 mt-2`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ShoppingCart size={18} /> {product.inStock !== false ? 'Consultar' : 'Consultar stock'}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <h3>No se encontraron resultados</h3>
                  <p>No hay productos en esta categoría o que coincidan con la búsqueda "{searchTerm}".</p>
                  <button className="btn btn-outline mt-3" onClick={handleClearFilters}>
                    Ver todos los productos
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              className="product-modal-card"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="product-modal-close" onClick={() => setSelectedProduct(null)}>
                <X size={24} />
              </button>
              
              <div className="product-modal-grid">
                
                {/* Image side */}
                <div className="product-modal-image-wrapper" style={{ position: 'relative' }}>
                  <img src={selectedProduct.img} alt={selectedProduct.name} style={!selectedProduct.inStock ? { opacity: 0.6 } : {}} />
                  {selectedProduct.condition && !['usado', 'nuevo'].includes(selectedProduct.condition.toLowerCase()) && (
                    <span className="product-modal-condition-tag">{selectedProduct.condition}</span>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end', zIndex: 10 }}>
                    {!selectedProduct.inStock && (
                      <div style={{ background: 'var(--color-danger, #e74c3c)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold' }}>
                        Consultar stock
                      </div>
                    )}
                    {selectedProduct.condition && selectedProduct.condition.toLowerCase() === 'usado' && (
                      <div style={{ background: 'var(--color-warning, #f39c12)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold' }}>
                        Usado
                      </div>
                    )}
                  </div>
                </div>

                {/* Content info side */}
                <div className="product-modal-details">
                  <span className="product-modal-category">{selectedProduct.category}</span>
                  <h2>{selectedProduct.name}</h2>
                  <p className="product-modal-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {selectedProduct.hasDiscount ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.7em', lineHeight: '1', marginBottom: '4px' }}>
                          {selectedProduct.currency === 'USD' ? 'U$D' : '$'} {formatPrice(selectedProduct.price)}
                        </span>
                        <strong style={{ color: 'var(--color-primary)', lineHeight: '1.2' }}>
                          {selectedProduct.currency === 'USD' ? 'U$D' : '$'} {formatPrice(selectedProduct.discountPrice)}
                        </strong>
                      </>
                    ) : (
                      <>{selectedProduct.currency === 'USD' ? 'U$D' : '$'} {formatPrice(selectedProduct.price)}</>
                    )}
                  </p>
                  {selectedProduct.hasExtra && (
                    <div className="product-modal-extra" style={{ fontSize: '1.1em', color: 'var(--color-secondary)', marginBottom: '1rem', fontWeight: '500' }}>
                      {selectedProduct.extraName} {selectedProduct.currency === 'USD' ? 'U$D' : '$'} {formatPrice(selectedProduct.extraPrice)}
                    </div>
                  )}
                  
                  {/* Badges details */}
                  <div className="product-modal-badges">
                    <div className="modal-badge-item">
                      <Info size={18} />
                      <div>
                        <strong>Disponibilidad</strong>
                        <span>{selectedProduct.inStock !== false ? "Inmediata" : "Consultar stock"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="product-modal-specs">
                    <h3>Especificaciones Técnicas</h3>
                    <ul>
                      {selectedProduct.specs.map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Payment Info */}
                  <div className="product-modal-payment">
                    <CreditCard size={18} />
                    <span>Aceptamos: Transferencia, Efectivo (Descuentos) o MercadoPago.</span>
                  </div>

                  {/* Action buttons */}
                  <div className="product-modal-actions">
                    <Link 
                      to="/cotizacion" 
                      state={{ 
                        selectType: 'venta', 
                        customMessage: `Hola! Me interesa consultar por el producto: ${selectedProduct.name} (Precio: ${selectedProduct.currency === 'USD' ? 'U$D' : '$'} ${selectedProduct.hasDiscount ? formatPrice(selectedProduct.discountPrice) : formatPrice(selectedProduct.price)}).\nQuisiera saber sobre el stock y formas de pago.` 
                      }} 
                      className={`btn ${!selectedProduct.inStock ? 'btn-outline' : 'btn-primary'} btn-large`}
                    >
                      <ShoppingCart size={18} /> {selectedProduct.inStock !== false ? 'Consultar por WhatsApp' : 'Consultar stock por WhatsApp'}
                    </Link>
                    <button className="btn btn-outline" onClick={() => setSelectedProduct(null)}>
                      Cerrar
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Store;
