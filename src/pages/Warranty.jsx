import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle } from 'lucide-react';
import './Warranty.css';

const Warranty = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Garantías | Reparo Tu Compu</title>
        <meta name="description" content="Información sobre nuestras garantías. 1 mes de garantía nuestra y 3 meses por parte del proveedor." />
      </Helmet>

      <section className="warranty-hero">
        <div className="container text-center">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            Políticas de Garantía
          </motion.h1>
          <motion.p 
            className="warranty-subtitle"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Nuestra prioridad es tu tranquilidad. Conoce cómo respaldamos nuestros productos y servicios.
          </motion.p>
        </div>
      </section>

      <section className="container pb-5">
        <div className="warranty-grid">
          <motion.div 
            className="warranty-card primary-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="warranty-icon">
              <Shield size={40} />
            </div>
            <h2>1 Mes de Garantía Nuestra</h2>
            <p>
              Ofrecemos 1 mes de garantía directa con nosotros para todos nuestros servicios de reparación técnica y armado de equipos. 
              Si el equipo presenta alguna falla relacionada con el trabajo realizado, te lo solucionamos sin costo adicional.
            </p>
            <ul className="warranty-list">
              <li><CheckCircle size={18} /> Mano de obra de reparación</li>
              <li><CheckCircle size={18} /> Ensamblaje de componentes</li>
              <li><CheckCircle size={18} /> Configuración de software base</li>
            </ul>
          </motion.div>

          <motion.div 
            className="warranty-card secondary-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="warranty-icon">
              <ShieldAlert size={40} />
            </div>
            <h2>3 Meses de Garantía Proveedor</h2>
            <p>
              Los componentes nuevos y periféricos adquiridos en nuestra tienda cuentan con 3 meses de garantía directa del proveedor o fabricante ante defectos de fábrica.
            </p>
            <ul className="warranty-list">
              <li><CheckCircle size={18} /> Placas de video, Mothers, CPUs</li>
              <li><CheckCircle size={18} /> Memorias RAM y Almacenamiento</li>
              <li><CheckCircle size={18} /> Fuentes de alimentación</li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="warranty-terms"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <h3>Términos y Condiciones</h3>
          <p>La garantía queda sin efecto en caso de:</p>
          <ul>
            <li>Daños físicos intencionales o accidentales (caídas, golpes, derrames de líquidos).</li>
            <li>Problemas de tensión eléctrica o descargas (se recomienda uso de estabilizador o UPS).</li>
            <li>Apertura o manipulación del equipo por personal no autorizado.</li>
            <li>Infecciones por virus, malware o uso de software pirata.</li>
          </ul>
        </motion.div>
      </section>
    </>
  );
};

export default Warranty;
