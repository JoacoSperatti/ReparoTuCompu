import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Calendar, User, Laptop } from 'lucide-react';
import { getDbTicket } from '../firebase';
import './Tracking.css';

const Tracking = () => {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = searchCode.trim().toUpperCase();
    if (!code) { setErrorMsg("Ingresá un código de ticket."); return; }

    setIsLoading(true);
    try {
      const ticket = await getDbTicket(code);
      if (ticket) {
        setSearchResult(ticket);
        setErrorMsg('');
      } else {
        setSearchResult(null);
        setErrorMsg("No encontramos ninguna orden con ese código.");
      }
    } catch {
      setErrorMsg("Error al buscar la orden.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Seguimiento de Reparación | Reparo Tu Compu</title>
      </Helmet>

      <section className="tracking-hero-premium">
        <div className="container text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gradient-text">
            Rastreador de Equipos
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="tracking-subtitle">
            Seguí el estado de tu reparación en tiempo real con calidad premium.
          </motion.p>
        </div>
      </section>

      <section className="tracking-content container">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="search-glass-container">
          <form className="search-form-premium" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={24} />
              <input 
                type="text" 
                placeholder="Ingresá tu código (Ej: RTC-1002)" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-glow">Consultar Estado</button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card text-center py-5 mt-5">
              <div className="spinner"></div>
            </motion.div>
          )}

          {errorMsg && !isLoading && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-alert error mt-5">
              <AlertCircle size={24} /> {errorMsg}
            </motion.div>
          )}

          {searchResult && !isLoading && (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="tracking-result-glass mt-5">
              <div className="result-header">
                <div>
                  <span className="badge badge-primary">{searchResult.ticketId}</span>
                  <h2>{searchResult.device}</h2>
                </div>
                <div className="delivery-box">
                  <span>Entrega Estimada</span>
                  <strong>{searchResult.estimatedDelivery}</strong>
                </div>
              </div>

              <div className="info-grid-glass mt-4">
                <div className="info-item">
                  <User size={20} className="text-primary"/>
                  <div>
                    <label>Cliente</label>
                    <p>{searchResult.clientName}</p>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={20} className="text-primary"/>
                  <div>
                    <label>Ingreso</label>
                    <p>{searchResult.entryDate}</p>
                  </div>
                </div>
                <div className="info-item">
                  <Laptop size={20} className="text-primary"/>
                  <div>
                    <label>Presupuesto</label>
                    <p className="text-success font-bold">{searchResult.priceEstimate}</p>
                  </div>
                </div>
              </div>

              <div className="diagnostic-glass mt-4">
                <h4>Falla reportada:</h4>
                <p>{searchResult.description}</p>
              </div>

              <div className="timeline-premium mt-5">
                <h3>Estado Actual</h3>
                <div className="progress-bar-glass mt-3" style={{ height: '12px' }}>
                  <motion.div 
                    className={`progress-fill ${searchResult.currentStep === 6 ? 'bg-success' : 'bg-primary'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((searchResult.currentStep - 1) / 5) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  ></motion.div>
                </div>
                <div className="progress-labels mt-2">
                  <span>Recibido</span>
                  <span>En Taller</span>
                  <span>Entregado</span>
                </div>
              </div>

              {searchResult.currentStep === 6 && (
                <div className="warranty-box mt-5">
                  <ShieldCheck size={24} className="text-success" />
                  <div>
                    <h4>Equipo Listo y Probado</h4>
                    <p>Tu reparación cuenta con 90 días de garantía. ¡Te esperamos para retirar!</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Tracking;
