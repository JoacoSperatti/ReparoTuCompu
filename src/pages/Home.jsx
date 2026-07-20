import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench, Cpu, RefreshCw, MonitorSmartphone, Star, MessageSquare, CheckCircle2, ChevronDown } from 'lucide-react';
import './Home.css';

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Diego Fernández",
    service: "Reparación de Notebook HP",
    rating: 5,
    comment: "Excelente servicio técnico. Diagnosticaron la falla de cortocircuito en placa en 24 horas y me la entregaron funcionando perfecta. Muy honestos con el precio.",
    date: "14/07/2026"
  },
  {
    id: 2,
    name: "Valeria Rossi",
    service: "Armado PC de Diseño",
    rating: 5,
    comment: "El asesoramiento para armar mi PC de trabajo fue impecable. Eligieron componentes de gran calidad respetando mi presupuesto. La gestión de cables es un arte.",
    date: "08/07/2026"
  },
  {
    id: 3,
    name: "Martín Benítez",
    service: "Plan Canje de Equipo",
    rating: 5,
    comment: "Entregué mi vieja PC de escritorio en parte de pago y me llevé una notebook increíble. Tasaron mi equipo de forma justa y el trámite fue súper ágil. Muy recomendados.",
    date: "28/06/2026"
  }
];

const FAQ_ITEMS = [
  {
    question: "¿El diagnóstico tiene costo si no apruebo el presupuesto?",
    answer: "No, en Reparo Tu Compu realizamos el diagnóstico inicial totalmente sin cargo en nuestro laboratorio. Si decidís no avanzar con la reparación propuesta, podés retirar tu equipo sin abonar absolutamente nada."
  },
  {
    question: "¿Voy a perder mis archivos o fotos personales al reparar mi equipo?",
    answer: "Para tu total tranquilidad, realizamos un respaldo completo (backup) de toda tu información antes de cualquier intervención de software o formateo. Tus archivos personales estarán totalmente a salvo."
  },
  {
    question: "¿Cuánto demora una reparación técnica habitual?",
    answer: "La mayoría de las reparaciones estándar (cambios de disco SSD, mantenimientos de temperatura o instalaciones de sistema) se completan en 24 a 48 horas hábiles. Falla electrónicas complejas en placas madres pueden demorar entre 3 y 5 días."
  },
  {
    question: "¿Hacen retiros a domicilio o soporte de manera remota?",
    answer: "Sí, realizamos retiros y entregas a domicilio dentro de nuestra zona de cobertura. También ofrecemos asistencia remota a través de AnyDesk para resolver inconvenientes de configuración de software, instalaciones o virus leves de forma inmediata."
  },
  {
    question: "¿Qué cubre la garantía que ofrecen en sus servicios?",
    answer: "Todos nuestros trabajos de mano de obra, armado de equipos y reparaciones cuentan con 1 mes de garantía directa en nuestro laboratorio. Si el equipo repite la falla dentro de ese período, lo solucionamos sin cargo extra."
  }
];

const Home = () => {
  // Load testimonials from localStorage or use defaults
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('rtc_testimonials');
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
  });

  // Accordion FAQ state
  const [activeFaq, setActiveFaq] = useState(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [ratingHover, setRatingHover] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rtc_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleAddTestimonial = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim() || !newService.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newName,
      service: newService,
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString('es-AR')
    };

    setTestimonials([newReview, ...testimonials]);
    setFormSubmitted(true);
    
    // Reset form fields
    setNewName('');
    setNewService('');
    setNewRating(5);
    setNewComment('');

    // Reset success banner after 4 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Helmet>
        <title>Inicio | Reparo Tu Compu</title>
        <meta name="description" content="¿Se te rompió la compu? Nosotros lo solucionamos. Armamos tu compu ideal a tu medida. Opiniones y presupuestos al instante." />
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
              Trabajamos con todas las marcas para ofrecerte el mejor servicio técnico, armado de equipos a medida y venta de hardware.
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

          <div className="grid grid-cols-4">
            <Link to="/cotizacion" state={{ selectType: 'reparacion' }} className="service-card-link">
              <motion.div 
                className="service-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="service-icon">
                  <Wrench size={32} />
                </div>
                <h3>Reparación de PC</h3>
                <p>¿Tu equipo falla, no enciende o anda lento? Hacé un autodiagnóstico con nuestro asistente virtual y obtené una solución estimada.</p>
              </motion.div>
            </Link>

            <Link to="/cotizacion" state={{ selectType: 'armado' }} className="service-card-link">
              <motion.div 
                className="service-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <div className="service-icon">
                  <Cpu size={32} />
                </div>
                <h3>Armado de PC</h3>
                <p>Contanos qué uso le vas a dar (Gamer, Oficina, Diseño) y te armamos un presupuesto a medida con los mejores componentes.</p>
              </motion.div>
            </Link>

            <Link to="/cotizacion" state={{ selectType: 'venta' }} className="service-card-link">
              <motion.div 
                className="service-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <div className="service-icon">
                  <MonitorSmartphone size={32} />
                </div>
                <h3>Venta</h3>
                <p>¿Buscás un equipo ya armado o una notebook? Dejanos tus requisitos y te ofrecemos las mejores opciones disponibles.</p>
              </motion.div>
            </Link>

            <Link to="/cotizacion" state={{ selectType: 'canje' }} className="service-card-link">
              <motion.div 
                className="service-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
              >
                <div className="service-icon">
                  <RefreshCw size={32} />
                </div>
                <h3>Plan Canje</h3>
                <p>Tomamos tu PC usada en parte de pago. Describinos tu equipo actual y el que te gustaría llevarte.</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section className="section faq-section">
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Preguntas Frecuentes</h2>
            <p className="section-desc">Despejá tus dudas sobre cómo trabajamos, plazos y garantías.</p>
          </motion.div>

          <div className="faq-accordion-container">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button 
                    className="faq-question-btn" 
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className="faq-chevron-icon" />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer-wrapper"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="faq-answer-text">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Interactive User Reviews) */}
      <section className="section testimonials-section section-alt">
        <div className="container">
          <motion.div 
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Opiniones de nuestros clientes</h2>
            <p className="section-desc">Leé lo que opinan quienes confiaron en nosotros o dejá tu propia experiencia.</p>
          </motion.div>

          <div className="testimonials-layout">
            
            {/* Reviews List */}
            <div className="testimonials-list-side">
              <div className="testimonials-scroll-box">
                <AnimatePresence initial={false}>
                  {testimonials.map((t) => (
                    <motion.div 
                      key={t.id}
                      className="testimonial-item-card"
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="testimonial-header">
                        <div className="testimonial-user-info">
                          <h4>{t.name}</h4>
                          <span className="testimonial-service-tag">{t.service}</span>
                        </div>
                        <span className="testimonial-date">{t.date}</span>
                      </div>
                      
                      <div className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < t.rating ? "star-icon filled" : "star-icon"} 
                          />
                        ))}
                      </div>
                      
                      <p className="testimonial-comment">"{t.comment}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit review form */}
            <div className="testimonials-form-side">
              <div className="review-form-card">
                <div className="form-card-header">
                  <MessageSquare size={20} className="text-primary" />
                  <h3>Dejanos tu opinión</h3>
                </div>
                
                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div 
                      key="form-success"
                      className="review-success-banner"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <CheckCircle2 size={36} className="text-success" />
                      <h4>¡Muchas gracias!</h4>
                      <p>Tu reseña ha sido publicada exitosamente en nuestro sitio web.</p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="review-form"
                      onSubmit={handleAddTestimonial}
                      className="review-form-element"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="form-group-review">
                        <label>Nombre y Apellido</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Juan Pérez" 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)} 
                          required 
                        />
                      </div>

                      <div className="form-group-review">
                        <label>¿Qué servicio realizaste?</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Reparación de PC, Armado Gamer, etc." 
                          value={newService} 
                          onChange={(e) => setNewService(e.target.value)} 
                          required 
                        />
                      </div>

                      <div className="form-group-review">
                        <label>Calificación</label>
                        <div className="star-rating-selector">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <button
                                type="button"
                                key={i}
                                className="star-select-btn"
                                onClick={() => setNewRating(starValue)}
                                onMouseEnter={() => setRatingHover(starValue)}
                                onMouseLeave={() => setRatingHover(null)}
                              >
                                <Star 
                                  size={28} 
                                  className={(ratingHover || newRating) >= starValue ? "star-selector-icon active" : "star-selector-icon"} 
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="form-group-review">
                        <label>Tu comentario</label>
                        <textarea 
                          rows="4" 
                          placeholder="Contanos tu experiencia con nuestro servicio técnico..." 
                          value={newComment} 
                          onChange={(e) => setNewComment(e.target.value)} 
                          required
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-primary w-100">Publicar Opinión</button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

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
            <Link to="/cotizacion" state={{ selectType: 'reparador' }} className="btn btn-primary">Contactar Ventas Mayoristas</Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
