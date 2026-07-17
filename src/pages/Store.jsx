import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShoppingCart } from 'lucide-react';
import './Store.css';

const categories = [
  "Todos", "Nuevas", "Usadas", "Gamer", "Oficina", "Hogar", "Notebooks", "Escritorio", "All in one",
  "Componentes", "Periféricos", "Monitores", "Teclados", "Parlantes", "Componentes pc", "Combos actualización"
];

const mockProducts = [
  { id: 1, name: "PC Gamer Extreme", price: 1200, category: "Gamer", img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Notebook Oficina Pro", price: 850, category: "Notebooks", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Monitor 24' IPS", price: 150, category: "Monitores", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Teclado Mecánico RGB", price: 80, category: "Teclados", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Combo Actualización Intel i5", price: 350, category: "Combos actualización", img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "PC Hogar Básica", price: 400, category: "Hogar", img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
];

const Store = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = activeCategory === "Todos" 
    ? mockProducts 
    : mockProducts.filter(p => p.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Tienda | Reparo Tu Compu</title>
        <meta name="description" content="Explora nuestro catálogo de PCs nuevas, usadas, gamers, componentes y periféricos." />
      </Helmet>

      <div className="store-layout container">
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

        <main className="store-main">
          <div className="store-header">
            <h2>Tienda Online</h2>
            <button className="filter-btn" onClick={() => setIsSidebarOpen(true)}>
              <Filter size={20} /> Filtros
            </button>
          </div>

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
                >
                  <div className="product-image">
                    <img src={product.img} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h4>{product.name}</h4>
                    <p className="product-price">${product.price}</p>
                    <button className="btn btn-primary w-100 mt-2">
                      <ShoppingCart size={18} /> Añadir
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No hay productos en esta categoría por el momento. (Catálogo en desarrollo)</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Store;
