import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShoppingCart, Search, X, Shield, Info, CreditCard } from 'lucide-react';
import { getDbProducts } from '../firebase';
import './Store.css';

const categories = [
  "Todos", "Nuevas", "Usadas", "Gamer", "Oficina", "Hogar", "Notebooks", "Escritorio", "All in one",
  "Componentes", "Periféricos", "Monitores", "Teclados", "Parlantes", "Componentes pc", "Combos actualización"
];

const Store = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  
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
    loadProducts();
  }, []);

  // Reset all filters
  const handleClearFilters = () => {
    setActiveCategory("Todos");
    setSearchTerm("");
    setSortBy("default");
  };

  // Filter & Sort logic
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      return 0; // Relevance / Default
    });

  return (
    <>
      <Helmet>
        <title>Tienda | Reparo Tu Compu</title>
        <meta name="description" content="Explora nuestro catálogo de PCs nuevas, usadas, gamers, componentes y periféricos con especificaciones técnicas detalladas." />
      </Helmet>

      <div className="store-layout container">
        
        {/* Categories Sidebar */}
        <aside className={`store-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Categorías</h3>
            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
          </div>
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
        </aside>

        {/* Main Content Area */}
        <main className="store-main">
          
          {/* Header */}
          <div className="store-header">
            <h2>Tienda Online</h2>
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
            {(activeCategory !== "Todos" || searchTerm || sortBy !== "default") && (
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
                      <div className="product-image">
                        <img src={product.img} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h4>{product.name}</h4>
                        <p className="product-price">${product.price}</p>
                        <Link 
                          to="/cotizacion" 
                          state={{ 
                            selectType: 'venta', 
                            customMessage: `Hola! Me interesa consultar por el producto: ${product.name} (Precio: $${product.price}).\nQuisiera saber sobre el stock y formas de pago.` 
                          }} 
                          className="btn btn-primary w-100 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ShoppingCart size={18} /> Consultar
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
                <div className="product-modal-image-wrapper">
                  <img src={selectedProduct.img} alt={selectedProduct.name} />
                  <span className="product-modal-condition-tag">{selectedProduct.condition}</span>
                </div>

                {/* Content info side */}
                <div className="product-modal-details">
                  <span className="product-modal-category">{selectedProduct.category}</span>
                  <h2>{selectedProduct.name}</h2>
                  <p className="product-modal-price">${selectedProduct.price}</p>
                  
                  {/* Badges details */}
                  <div className="product-modal-badges">
                    <div className="modal-badge-item">
                      <Shield size={18} />
                      <div>
                        <strong>Garantía</strong>
                        <span>{selectedProduct.warranty}</span>
                      </div>
                    </div>
                    <div className="modal-badge-item">
                      <Info size={18} />
                      <div>
                        <strong>Disponibilidad</strong>
                        <span>{selectedProduct.stock}</span>
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
                        customMessage: `Hola! Me interesa consultar por el producto: ${selectedProduct.name} (Precio: $${selectedProduct.price}).\nQuisiera saber sobre el stock y formas de pago.` 
                      }} 
                      className="btn btn-primary btn-large"
                    >
                      <ShoppingCart size={18} /> Consultar por WhatsApp
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
