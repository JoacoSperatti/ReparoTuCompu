import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Cpu, ShieldCheck } from 'lucide-react';
import './Home.css';

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Helmet>
        <title>Inicio | Reparo Tu Compu</title>
        <meta name="description" content="¿Se te rompió la compu? Nosotros lo solucionamos. Armamos tu compu ideal a tu medida. Trabajamos con todas las marcas." />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1>¿Se te rompió la compu?<br/><span className="text-primary">Nosotros lo solucionamos</span></h1>
            <p className="hero-subtitle">
              Trabajamos con todas las marcas para ofrecerte el mejor servicio técnico y venta de equipos informáticos.
            </p>
            <div className="hero-buttons">
              <Link to="/cotizacion" className="btn btn-primary">Cotizar ahora</Link>
              <Link to="/tienda" className="btn btn-outline">Ver tienda</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section section-alt">
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeInUp}
          >
            <h2>Nuestros Servicios Principales</h2>
            <p className="section-desc">Descubrí todo lo que podemos hacer por vos y tu equipo.</p>
          </motion.div>

          <div className="grid grid-cols-3">
            <motion.div 
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="service-icon">
                <Settings size={32} />
              </div>
              <h3>Reparación</h3>
              <p>Solucionamos problemas de hardware y software en tiempo récord. Trabajamos con PC de escritorio, notebooks y all in one.</p>
            </motion.div>

            <motion.div 
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <div className="service-icon">
                <Cpu size={32} />
              </div>
              <h3>Armamos tu compu ideal a tu medida</h3>
              <p>PCs Gamer, de oficina, o para diseño. Te asesoramos para que obtengas el mejor rendimiento según tu presupuesto.</p>
            </motion.div>

            <motion.div 
              className="service-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <div className="service-icon">
                <ShieldCheck size={32} />
              </div>
              <h3>Plan Canje</h3>
              <p>¿Querés actualizarte? Tomamos tu PC antigua en parte de pago para que te lleves un equipo nuevo o mejorado.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Reparadores */}
      <section className="section cta-section">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>¿Sos reparador?</h2>
            <p className="mb-4 text-large">Consúltanos por mejores precios y descuentos exclusivos para el gremio.</p>
            <Link to="/cotizacion" className="btn btn-primary">Contactar Ventas Mayoristas</Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
