import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Cpu, Lock, Calendar, LogOut, Wrench, ShieldCheck, 
  CheckCircle2, AlertCircle, PlayCircle, Settings
} from 'lucide-react';
import { getDbClients, saveDbClient, getDbTickets } from '../firebase';
import { CONFIG } from '../config';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedClient, setLoggedClient] = useState(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [clientTickets, setClientTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rtc_logged_client');
    if (saved) {
      const client = JSON.parse(saved);
      setLoggedClient(client);
      fetchTicketsForClient(client);
    }
  }, []);

  const fetchTicketsForClient = async (client) => {
    setIsLoadingTickets(true);
    try {
      const allTickets = await getDbTickets();
      const clientNameLower = client.name.toLowerCase().trim();
      const matched = Object.values(allTickets).filter(ticket => 
        (ticket.clientName || '').toLowerCase().trim().includes(clientNameLower)
      );
      setClientTickets(matched);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const clients = await getDbClients();
      if (isLogin) {
        const found = clients.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
        if (found) {
          setLoggedClient(found);
          localStorage.setItem('rtc_logged_client', JSON.stringify(found));
          fetchTicketsForClient(found);
        } else {
          setErrorMsg('Credenciales incorrectas');
        }
      } else {
        if (!name || !email || !password || !phone) {
          setErrorMsg('Completá todos los campos'); return;
        }
        const exists = clients.some(c => c.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          setErrorMsg('El email ya está registrado'); return;
        }
        const newClient = {
          id: Date.now(), name, email, phone, password,
          device: 'No especificado',
          lastMaintenance: new Date().toISOString().split('T')[0]
        };
        await saveDbClient(newClient);
        setLoggedClient(newClient);
        localStorage.setItem('rtc_logged_client', JSON.stringify(newClient));
        setClientTickets([]);
      }
    } catch (err) {
      setErrorMsg('Error de conexión');
    }
  };

  const handleLogout = () => {
    setLoggedClient(null);
    localStorage.removeItem('rtc_logged_client');
    setEmail(''); setPassword('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      <Helmet>
        <title>{loggedClient ? 'Portal de Cliente' : 'Acceso Clientes'} | Reparo Tu Compu</title>
      </Helmet>

      <section className="portal-hero">
        <div className="portal-hero-bg"></div>
        <div className="container text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gradient-text">
            {loggedClient ? `Hola, ${loggedClient.name.split(' ')[0]}` : 'Portal de Clientes'}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="portal-subtitle">
            {loggedClient ? 'Tus reparaciones, presupuestos y garantías en un solo lugar.' : 'Ingresá para seguir el estado de tus reparaciones en tiempo real.'}
          </motion.p>
        </div>
      </section>

      <section className="portal-content container">
        <AnimatePresence mode="wait">
          {!loggedClient ? (
            <motion.div key="auth" variants={containerVariants} initial="hidden" animate="visible" exit="hidden" className="glass-auth-box">
              <div className="auth-switcher">
                <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Ingresar</button>
                <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Registrarse</button>
              </div>
              <div className="auth-body">
                {errorMsg && <div className="glass-alert error"><AlertCircle size={18}/> {errorMsg}</div>}
                
                <form onSubmit={handleAuth} className="glass-form">
                  {!isLogin && (
                    <div className="form-group-glass">
                      <label><User size={16}/> Nombre Completo</label>
                      <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
                    </div>
                  )}
                  <div className="form-group-glass">
                    <label><Mail size={16}/> Email</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
                  </div>
                  {!isLogin && (
                    <div className="form-group-glass">
                      <label><Phone size={16}/> Teléfono</label>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required />
                    </div>
                  )}
                  <div className="form-group-glass">
                    <label><Lock size={16}/> Contraseña</label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 glow-effect mt-4">
                    {isLogin ? 'Acceder al Portal' : 'Crear Cuenta'}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="visible" className="portal-dashboard">
              
              {/* Dashboard Sidebar */}
              <div className="dashboard-sidebar">
                <div className="glass-card profile-card">
                  <div className="profile-avatar"><User size={40}/></div>
                  <h3>{loggedClient.name}</h3>
                  <p>{loggedClient.email}</p>
                  <button onClick={handleLogout} className="btn btn-outline w-100 mt-4 border-radius-xl">
                    <LogOut size={16}/> Salir
                  </button>
                </div>

                <div className="glass-card mt-4 promo-card">
                  <h4>¿Necesitas otra reparación?</h4>
                  <p>Solicitá un nuevo presupuesto rápido.</p>
                  <a href="/cotizacion" className="btn btn-primary w-100 glow-effect mt-2">Nueva Consulta</a>
                </div>
              </div>

              {/* Dashboard Main Area */}
              <div className="dashboard-main">
                <h2 className="section-title">Mis Equipos en Laboratorio</h2>
                
                {isLoadingTickets ? (
                  <div className="glass-card text-center py-5"><div className="spinner"></div></div>
                ) : clientTickets.length === 0 ? (
                  <div className="glass-card empty-state">
                    <ShieldCheck size={48} className="text-muted mb-3" />
                    <h3>Sin reparaciones activas</h3>
                    <p>Actualmente no tenés equipos en nuestro laboratorio.</p>
                  </div>
                ) : (
                  <div className="tickets-grid">
                    {clientTickets.map(ticket => {
                      const progress = ((ticket.currentStep - 1) / 5) * 100;
                      const isDone = ticket.currentStep === 6;
                      
                      return (
                        <motion.div whileHover={{ y: -5 }} key={ticket.ticketId} className="glass-card ticket-card">
                          <div className="ticket-header">
                            <div>
                              <span className="badge badge-primary">{ticket.ticketId}</span>
                              <h3 className="mt-2">{ticket.device}</h3>
                            </div>
                            <div className="ticket-status-icon">
                              {isDone ? <CheckCircle2 size={24} className="text-success" /> : <Settings size={24} className="spin-slow text-primary" />}
                            </div>
                          </div>
                          
                          <div className="ticket-progress-wrapper mt-4">
                            <div className="progress-info">
                              <span>Fase {ticket.currentStep}/6</span>
                              <span>{isDone ? 'Completado' : 'En proceso'}</span>
                            </div>
                            <div className="progress-bar-glass">
                              <motion.div 
                                className={`progress-fill ${isDone ? 'bg-success' : 'bg-primary'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                              ></motion.div>
                            </div>
                          </div>
                          
                          <div className="ticket-details mt-4">
                            <div className="detail-row">
                              <span className="label">Ingreso:</span>
                              <span>{ticket.entryDate}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Entrega aprox:</span>
                              <span className="text-primary font-bold">{ticket.estimatedDelivery}</span>
                            </div>
                          </div>

                          {isDone && (
                            <div className="warranty-box mt-4">
                              <ShieldCheck size={18} className="text-success" />
                              <span>Garantía Activa por 90 días</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Auth;
