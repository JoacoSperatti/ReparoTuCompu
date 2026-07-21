import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand, X } from 'lucide-react';
import './Services.css';

const portfolioItems = [
  {
    id: 1,
    title: "PC Gamer Custom Watercooling",
    category: "Armado Gamer",
    description: "Armado de PC Gamer de alta gama con sistema de refrigeración líquida personalizada. Intel i9, RTX 4080, 32GB RAM RGB.",
    img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Mantenimiento y Limpieza Profunda",
    category: "Reparación",
    description: "Restauración térmica y limpieza integral de PC de escritorio que sufría sobrecalentamiento extremo. Cambio de pasta térmica y gestión de cables.",
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Setup de Oficina Minimalista",
    category: "Armado Oficina",
    description: "Armado e instalación de 5 estaciones de trabajo compactas para estudio contable. Rendimiento eficiente y diseño que ahorra espacio.",
    img: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Reparación de Notebook (Cambio de Pantalla)",
    category: "Reparación",
    description: "Sustitución de panel IPS dañado en notebook de diseño. Calibración de color posterior para asegurar fidelidad visual.",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Actualización (Plan Canje)",
    category: "Actualización",
    description: "El cliente entregó su antigua PC de 4ta generación. Ensamblamos un nuevo equipo Ryzen 5 con almacenamiento NVMe ultrarrápido.",
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Gestión de Cables Perfecta",
    category: "Armado",
    description: "Cable management profesional en un gabinete con panel de cristal templado. Estética limpia y flujo de aire optimizado.",
    img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const categories = ["Todos", ...new Set(portfolioItems.map(item => item.category))];

const Services = () => {
  const [filter, setFilter] = useState("Todos");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = filter === "Todos" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Galería de Trabajos y Servicios | Reparo Tu Compu</title>
        <meta name="description" content="Mirá nuestros trabajos realizados: armados de PC gamer con watercooling, setups de oficina, reparaciones de notebooks, gestión de cables y más." />
        <link rel="canonical" href="https://reparotucompu.com.ar/servicios" />
        <meta property="og:title" content="Galería de Trabajos | Reparo Tu Compu" />
        <meta property="og:description" content="PC gamers, setups de oficina, reparaciones complejas y más. Verís en qué somos buenos." />
        <meta property="og:url" content="https://reparotucompu.com.ar/servicios" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="portfolio-hero">
        <div className="container text-center">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            Nuestros Servicios
          </motion.h1>
          <motion.p 
            className="portfolio-subtitle"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Explorá nuestra galería y descubrí la calidad de nuestros armados, reparaciones y restauraciones.
          </motion.p>
        </div>
      </section>

      <section className="services-content-section container">
        <div className="portfolio-filters">
          {categories.map((cat, index) => (
            <button 
              key={index}
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="portfolio-grid">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="portfolio-card"
                onClick={() => setSelectedImage(item)}
              >
                <div className="portfolio-image-wrapper">
                  <img src={item.img} alt={item.title} loading="lazy" />
                  <div className="portfolio-overlay">
                    <Expand size={32} color="white" />
                  </div>
                </div>
                <div className="portfolio-info">
                  <span className="portfolio-category">{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <X size={32} />
            </button>
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.img} alt={selectedImage.title} />
              <div className="lightbox-details">
                <span className="lightbox-category">{selectedImage.category}</span>
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;
