import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, Clock, CheckCircle2, Wrench, AlertCircle, Laptop, User, Calendar, ClipboardList } from 'lucide-react';
import { CONFIG } from '../config';
import { getDbTicket } from '../firebase';
import './Tracking.css';

const STEPS = [
  { step: 1, label: "Recibido", icon: ClipboardList, desc: "Equipo ingresado al sistema" },
  { step: 2, label: "Diagnóstico", icon: Search, desc: "Evaluación técnica de fallas" },
  { step: 3, label: "Presupuesto", icon: Clock, desc: "Esperando aprobación" },
  { step: 4, label: "En Reparación", icon: Wrench, desc: "Manos a la obra" },
  { step: 5, label: "Pruebas", icon: ShieldCheck, desc: "Control de calidad y estrés" },
  { step: 6, label: "Listo", icon: CheckCircle2, desc: "Listo para retirar" }
];

const Tracking = () => {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = searchCode.trim().toUpperCase();
    
    if (!code) {
      setErrorMsg("Por favor, ingresá un código de ticket.");
      setSearchResult(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    try {
      const ticket = await getDbTicket(code);
      if (ticket) {
        setSearchResult(ticket);
        setErrorMsg('');
      } else {
        setSearchResult(null);
        setErrorMsg("No encontramos ninguna orden con ese código. Verificá si está escrito correctamente (Ej. RTC-1002).");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocurrió un error al buscar la orden. Intentalo de nuevo.");
      setSearchResult(null);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <Helmet>
        <title>Seguimiento de Reparación | Reparo Tu Compu</title>
        <meta name="description" content="Ingresá tu número de orden para verificar el estado de tu reparación en tiempo real." />
      </Helmet>

      <section className="tracking-hero">
        <div className="container text-center">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
          >
            Seguimiento de Equipo
          </motion.h1>
          <motion.p 
            className="tracking-subtitle"
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Mantenete al tanto del proceso de reparación de tu PC o Notebook ingresando tu código de ticket.
          </motion.p>
        </div>
      </section>

      <section className="tracking-content-section container">
        <div className="search-container-box">
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Ej. RTC-1002" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn">Consultar Estado</button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
              style={{ color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div className="loading-spinner"></div>
              <p>Buscando orden de reparación...</p>
            </motion.div>
          )}

          {errorMsg && !isLoading && (
            <motion.div 
              key="error-box"
              className="error-message-box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={24} />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {hasSearched && searchResult && !isLoading && (
            <motion.div 
              key={searchResult.ticketId}
              className="result-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header Info */}
              <div className="result-header">
                <div className="header-title-section">
                  <span className="ticket-badge">{searchResult.ticketId}</span>
                  <h2>{searchResult.device}</h2>
                </div>
                <div className="header-delivery">
                  <span className="delivery-label">Entrega estimada:</span>
                  <span className="delivery-date">{searchResult.estimatedDelivery}</span>
                </div>
              </div>

              {/* Client and Info Grid */}
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-item-title">
                    <User size={18} />
                    <span>Cliente</span>
                  </div>
                  <p>{searchResult.clientName}</p>
                </div>
                <div className="info-item">
                  <div className="info-item-title">
                    <Calendar size={18} />
                    <span>Fecha de Ingreso</span>
                  </div>
                  <p>{searchResult.entryDate}</p>
                </div>
                <div className="info-item">
                  <div className="info-item-title">
                    <Laptop size={18} />
                    <span>Presupuesto Estimado</span>
                  </div>
                  <p className="price-tag">{searchResult.priceEstimate}</p>
                </div>
              </div>

              <div className="diagnostic-summary">
                <h4>Falla reportada:</h4>
                <p>{searchResult.description}</p>
              </div>

              {/* Progress Timeline */}
              <div className="timeline-container">
                <h3 className="timeline-title">Estado de la Reparación</h3>
                
                {/* Horizontal Progress Bar for Desktop */}
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${((searchResult.currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-steps">
                    {STEPS.map((step) => {
                      const StepIcon = step.icon;
                      const isCompleted = step.step < searchResult.currentStep;
                      const isCurrent = step.step === searchResult.currentStep;
                      
                      return (
                        <div 
                          key={step.step} 
                          className={`step-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                        >
                          <div className="step-icon-circle">
                            <StepIcon size={20} />
                          </div>
                          <span className="step-label">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vertical Timeline for Mobile */}
                <div className="mobile-timeline">
                  {STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isCompleted = step.step < searchResult.currentStep;
                    const isCurrent = step.step === searchResult.currentStep;

                    return (
                      <div 
                        key={step.step} 
                        className={`mobile-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                      >
                        <div className="mobile-step-line"></div>
                        <div className="mobile-step-circle">
                          <StepIcon size={16} />
                        </div>
                        <div className="mobile-step-content">
                          <h4>{step.label}</h4>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latest Status Notes */}
              <div className="status-notes-box">
                <h4>Nota técnica actual:</h4>
                <p className="notes-text">{searchResult.statusNotes}</p>
              </div>

              {/* Timeline History log */}
              <div className="history-log">
                <h4>Registro de Actividad</h4>
                <div className="history-list">
                  {searchResult.history.slice().reverse().map((item, idx) => (
                    <div key={idx} className="history-log-item">
                      <span className="history-date">{item.date}</span>
                      <span className="history-text">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Query Call to Action */}
              <div className="tracking-cta">
                <p>¿Querés comunicarte con el técnico a cargo por esta orden?</p>
                <a 
                  href={`https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=Hola! Quería consultar sobre el estado del ticket ${searchResult.ticketId} (${searchResult.device}).`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline"
                >
                  Consultar vía WhatsApp
                </a>
              </div>
            </motion.div>
          )}

          {hasSearched && !searchResult && !errorMsg && !isLoading && (
            <motion.div 
              key="not-found"
              className="error-message-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={24} />
              <span>No se encontró la orden técnica especificada.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Tracking;
