import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Wrench, MonitorSmartphone, RefreshCw } from 'lucide-react';
import './Quote.css';

const Quote = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Cotización | Reparo Tu Compu</title>
        <meta name="description" content="Solicitá presupuesto para armado de PC, venta o plan canje (tomamos tu PC en parte de pago)." />
      </Helmet>

      <section className="quote-hero">
        <div className="container text-center">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            Solicitá tu Cotización
          </motion.h1>
          <motion.p 
            className="quote-subtitle"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Elegí el servicio que necesitás y nos pondremos en contacto con vos a la brevedad.
          </motion.p>
        </div>
      </section>

      <section className="quote-options-section container">
        <div className="grid grid-cols-3">
          <motion.div 
            className="quote-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="quote-icon">
              <Wrench size={32} />
            </div>
            <h3>Armado de PC</h3>
            <p>Contanos qué uso le vas a dar (Gamer, Oficina, Diseño) y te armamos un presupuesto a medida con los mejores componentes.</p>
            <button className="btn btn-primary w-100 mt-auto">Cotizar Armado</button>
          </motion.div>

          <motion.div 
            className="quote-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="quote-icon">
              <MonitorSmartphone size={32} />
            </div>
            <h3>Venta</h3>
            <p>¿Buscás un equipo ya armado o una notebook? Dejanos tus requisitos y te ofrecemos las mejores opciones disponibles.</p>
            <button className="btn btn-primary w-100 mt-auto">Consultar Stock</button>
          </motion.div>

          <motion.div 
            className="quote-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="quote-icon">
              <RefreshCw size={32} />
            </div>
            <h3>Plan Canje</h3>
            <p>Tomamos tu PC usada en parte de pago. Describinos tu equipo actual y el que te gustaría llevarte.</p>
            <button className="btn btn-primary w-100 mt-auto">Cotizar Canje</button>
          </motion.div>
        </div>
      </section>
      
      <section className="quote-form-section container pb-5">
        <div className="quote-form-container">
          <h2 className="text-center mb-4">Envíanos tu consulta</h2>
          <form className="quote-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Nombre y Apellido</label>
              <input type="text" placeholder="Ej. Juan Pérez" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="tu@email.com" required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="Código de área + Número" required />
              </div>
            </div>
            <div className="form-group">
              <label>Tipo de consulta</label>
              <select required>
                <option value="">Seleccioná una opción...</option>
                <option value="armado">Armado de PC a medida</option>
                <option value="venta">Venta de equipo</option>
                <option value="canje">Plan Canje</option>
                <option value="reparador">Soy reparador (Mayorista)</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mensaje / Detalles del equipo</label>
              <textarea rows="5" placeholder="Detallá acá todo lo necesario..." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-large">Enviar Consulta</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Quote;
