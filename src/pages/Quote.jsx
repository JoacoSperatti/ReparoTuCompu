import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  MonitorSmartphone, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  HelpCircle
} from 'lucide-react';
import { CONFIG } from '../config';
import './Quote.css';

const SERVICE_TYPES = [
  { id: 'reparacion', title: 'Reparación', icon: Wrench, desc: 'Reparación de PC, Notebooks y All in One.' },
  { id: 'armado', title: 'Armado de PC', icon: Cpu, desc: 'Presupuesto a medida para Gaming, Oficina o Diseño.' },
  { id: 'venta', title: 'Venta', icon: MonitorSmartphone, desc: 'Equipos armados y notebooks nuevas.' },
  { id: 'canje', title: 'Plan Canje', icon: RefreshCw, desc: 'Entregá tu PC usada como parte de pago.' },
  { id: 'reparador', title: 'Soy Técnico', icon: Settings, desc: 'Precios mayoristas y descuentos para el gremio.' },
  { id: 'otro', title: 'Otro', icon: HelpCircle, desc: 'Otras consultas técnicas o comerciales.' }
];

const Quote = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const formRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.selectType) {
      setServiceType(location.state.selectType);
      setStep(2);
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  const handleNext = () => {
    if (step === 1 && !serviceType) return;
    if (step === 2 && !details.trim()) return;
    setStep((s) => s + 1);
  };

  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const typeLabel = SERVICE_TYPES.find(t => t.id === serviceType)?.title || serviceType;

    const whatsappText = `*Nueva Cotización - Reparo Tu Compu*\n\n` +
      `*Servicio:* ${typeLabel}\n\n` +
      `*Detalles:*\n${details}\n\n` +
      `*Cliente:* ${contact.name}\n` +
      `*Email:* ${contact.email}\n` +
      `*Teléfono:* ${contact.phone}`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <>
      <Helmet>
        <title>Cotización Online | Reparo Tu Compu</title>
      </Helmet>

      <section className="quote-hero-premium">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Solicitá tu Cotización
          </motion.h1>
          <motion.p className="quote-subtitle-premium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Completa nuestro asistente rápido de 3 pasos y obtené respuesta inmediata.
          </motion.p>
        </div>
      </section>

      <section className="quote-wizard-section container" ref={formRef}>
        <div className="quote-glass-container">
          
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                className="quote-success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="success-icon-wrapper">
                  <CheckCircle2 size={80} />
                </div>
                <h2>¡Enviado con Éxito!</h2>
                <p>Te redirigimos a WhatsApp para completar la solicitud.</p>
                <button className="btn btn-outline mt-4" onClick={() => { setIsSubmitted(false); setStep(1); setServiceType(''); setDetails(''); setContact({name:'', email:'', phone:''}); }}>
                  Nueva Consulta
                </button>
              </motion.div>
            ) : (
              <div className="quote-wizard-layout">
                {/* Wizard Progress Sidebar */}
                <div className="wizard-progress-sidebar">
                  {[
                    { num: 1, label: 'Servicio' },
                    { num: 2, label: 'Detalles' },
                    { num: 3, label: 'Contacto' }
                  ].map((s) => (
                    <div key={s.num} className={`progress-step-premium ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
                      <div className="step-circle">{step > s.num ? <CheckCircle2 size={16} /> : s.num}</div>
                      <span className="step-label">{s.label}</span>
                    </div>
                  ))}
                  <div className="progress-line-bg">
                    <div className="progress-line-fill" style={{ height: `${((step - 1) / 2) * 100}%` }}></div>
                  </div>
                </div>

                {/* Wizard Content Area */}
                <div className="wizard-content-area">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="step1" {...pageTransition} className="step-content">
                        <h3>1. ¿Qué servicio necesitás?</h3>
                        <div className="service-types-grid">
                          {SERVICE_TYPES.map(type => {
                            const Icon = type.icon;
                            return (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={type.id}
                                className={`service-type-card ${serviceType === type.id ? 'selected' : ''}`}
                                onClick={() => setServiceType(type.id)}
                              >
                                <Icon size={32} />
                                <h4>{type.title}</h4>
                                <p>{type.desc}</p>
                              </motion.div>
                            );
                          })}
                        </div>
                        <div className="wizard-actions">
                          <div></div>
                          <button className="btn btn-primary" onClick={handleNext} disabled={!serviceType}>
                            Siguiente <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" {...pageTransition} className="step-content">
                        <h3>2. Contanos más detalles</h3>
                        <p className="step-desc">Ingresá información sobre el equipo, fallas, presupuesto o cualquier dato relevante para cotizar mejor.</p>
                        
                        <div className="form-group-premium">
                          <textarea 
                            rows="6"
                            placeholder="Ej: Tengo una Notebook HP que enciende pero no da imagen..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                          />
                        </div>

                        <div className="wizard-actions">
                          <button className="btn btn-outline" onClick={handlePrev}>
                            <ArrowLeft size={18} /> Volver
                          </button>
                          <button className="btn btn-primary" onClick={handleNext} disabled={!details.trim()}>
                            Siguiente <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" {...pageTransition} className="step-content">
                        <h3>3. Tus datos de contacto</h3>
                        <p className="step-desc">Completá tus datos para que podamos contactarte y enviarte el presupuesto final por WhatsApp.</p>
                        
                        <form onSubmit={handleSubmit} className="contact-form-premium">
                          <div className="form-group-premium">
                            <label>Nombre y Apellido</label>
                            <input type="text" required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} placeholder="Juan Pérez" />
                          </div>
                          <div className="form-row-premium">
                            <div className="form-group-premium">
                              <label>Email</label>
                              <input type="email" required value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} placeholder="tu@email.com" />
                            </div>
                            <div className="form-group-premium">
                              <label>Teléfono / WhatsApp</label>
                              <input type="tel" required value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} placeholder="+54 9 11..." />
                            </div>
                          </div>

                          <div className="wizard-actions mt-4">
                            <button type="button" className="btn btn-outline" onClick={handlePrev}>
                              <ArrowLeft size={18} /> Volver
                            </button>
                            <button type="submit" className="btn btn-primary btn-glow">
                              Solicitar Cotización <CheckCircle2 size={18} />
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </AnimatePresence>
          
        </div>
      </section>
    </>
  );
};

export default Quote;
