import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Cpu, 
  Lock, 
  Calendar, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  AlertTriangle,
  Gift,
  RefreshCw,
  Notebook
} from 'lucide-react';
import { getDbClients, saveDbClient, getDbTickets } from '../firebase';
import './Auth.css';

const Auth = () => {
  // Authentication states
  const [isLogin, setIsLogin] = useState(true);
  const [loggedClient, setLoggedClient] = useState(null);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState('');
  const [lastMaintenance, setLastMaintenance] = useState(new Date().toISOString().split('T')[0]);

  // Preference switches
  const [maintenanceSub, setMaintenanceSub] = useState(true);
  const [offersSub, setOffersSub] = useState(true);
  const [newsSub, setNewsSub] = useState(true);
  const [canjeSub, setCanjeSub] = useState(true);

  // Message states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Loaded client data
  const [clientTickets, setClientTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rtc_logged_client');
    if (saved) {
      const client = JSON.parse(saved);
      setLoggedClient(client);
      fetchTicketsForClient(client);
    }
  }, []);

  // Fetch tickets that match the client name
  const fetchTicketsForClient = async (client) => {
    setIsLoadingTickets(true);
    try {
      const allTickets = await getDbTickets();
      const clientNameLower = client.name.toLowerCase().trim();
      
      const matched = Object.values(allTickets).filter(ticket => {
        const ticketNameLower = (ticket.clientName || '').toLowerCase().trim();
        return ticketNameLower.includes(clientNameLower) || clientNameLower.includes(ticketNameLower);
      });
      setClientTickets(matched);
    } catch (error) {
      console.error("Error fetching client tickets:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const clients = await getDbClients();
      const found = clients.find(
        c => c.email.toLowerCase().trim() === email.toLowerCase().trim() && c.password === password
      );

      if (found) {
        setLoggedClient(found);
        localStorage.setItem('rtc_logged_client', JSON.stringify(found));
        setSuccessMsg('¡Sesión iniciada con éxito!');
        fetchTicketsForClient(found);
      } else {
        setErrorMsg('Correo electrónico o contraseña incorrectos.');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      const clients = await getDbClients();
      const emailExists = clients.some(c => c.email.toLowerCase().trim() === email.toLowerCase().trim());

      if (emailExists) {
        setErrorMsg('Este correo electrónico ya está registrado.');
        return;
      }

      const newClient = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        device: device.trim() || 'No especificado',
        password: password, // For simplicity of this tech demo/project
        lastMaintenance: lastMaintenance || new Date().toISOString().split('T')[0],
        preferences: {
          maintenanceSub,
          offersSub,
          newsSub,
          canjeSub
        },
        registeredAt: new Date().toLocaleDateString('es-AR')
      };

      await saveDbClient(newClient);
      setLoggedClient(newClient);
      localStorage.setItem('rtc_logged_client', JSON.stringify(newClient));
      setSuccessMsg('¡Registro exitoso! Sesión iniciada.');
      setClientTickets([]); // New client has no tickets initially
    } catch (err) {
      setErrorMsg('Ocurrió un error al registrarte. Inténtalo de nuevo.');
    }
  };

  const handleLogout = () => {
    setLoggedClient(null);
    localStorage.removeItem('rtc_logged_client');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setDevice('');
    setSuccessMsg('Sesión cerrada correctamente.');
  };

  const handleUpdatePreferences = async (prefType, val) => {
    if (!loggedClient) return;

    const updatedClient = {
      ...loggedClient,
      preferences: {
        ...loggedClient.preferences,
        [prefType]: val
      }
    };

    setLoggedClient(updatedClient);
    localStorage.setItem('rtc_logged_client', JSON.stringify(updatedClient));
    await saveDbClient(updatedClient);
  };

  // Helper: Maintenance math (6 months)
  const getMaintenanceStatus = (lastDateStr) => {
    if (!lastDateStr) return { label: 'Desconocido', color: 'text-muted' };
    const lastDate = new Date(lastDateStr);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 6);

    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedNext = nextDate.toLocaleDateString('es-AR');

    if (diffDays < 0) {
      return { 
        label: `Vencido el ${formattedNext} (Hacer ya)`, 
        daysLeft: diffDays, 
        isOverdue: true, 
        color: 'var(--color-danger)' 
      };
    } else if (diffDays <= 15) {
      return { 
        label: `Vence el ${formattedNext} (Pronto)`, 
        daysLeft: diffDays, 
        isSoon: true, 
        color: 'var(--color-warning)' 
      };
    } else {
      return { 
        label: `${formattedNext} (En fecha)`, 
        daysLeft: diffDays, 
        color: 'var(--color-success)' 
      };
    }
  };

  const maintStatus = loggedClient ? getMaintenanceStatus(loggedClient.lastMaintenance) : null;

  return (
    <>
      <Helmet>
        <title>{loggedClient ? 'Área de Clientes' : 'Acceso Clientes'} | Reparo Tu Compu</title>
        <meta name="description" content="Inicia sesión o regístrate en Reparo Tu Compu. Gestiona tus reparaciones y haz seguimiento a tus equipos." />
      </Helmet>

      <div className="auth-page-container container py-5">
        <AnimatePresence mode="wait">
          {!loggedClient ? (
            /* AUTHENTICATION FORM (LOGIN / REGISTER) */
            <motion.div 
              key="auth-forms"
              className="auth-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="auth-tabs">
                <button 
                  className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                >
                  Iniciar Sesión
                </button>
                <button 
                  className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                >
                  Registrarse
                </button>
              </div>

              <div className="auth-card-body">
                <h3>{isLogin ? '¡Qué bueno verte de nuevo!' : 'Unite a nuestra comunidad de clientes'}</h3>
                <p className="auth-sub">
                  {isLogin 
                    ? 'Accedé para ver el estado de tus reparaciones, fechas de mantenimiento y promociones exclusivas.' 
                    : 'Registrá tus datos para recibir recordatorios automáticos de mantenimiento cada 6 meses, novedades y ofertas de plan canje.'}
                </p>

                {errorMsg && <div className="auth-alert alert-error">{errorMsg}</div>}
                {successMsg && <div className="auth-alert alert-success">{successMsg}</div>}

                {isLogin ? (
                  /* LOGIN FORM */
                  <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group-auth">
                      <label><Mail size={16} /> Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                      />
                    </div>

                    <div className="form-group-auth">
                      <label><Lock size={16} /> Contraseña</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3">Ingresar al Área de Clientes</button>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-grid-auth">
                      <div className="form-group-auth">
                        <label><User size={16} /> Nombre y Apellido *</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Juan Pérez"
                          required
                        />
                      </div>

                      <div className="form-group-auth">
                        <label><Mail size={16} /> Correo Electrónico *</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="juan@correo.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-auth">
                      <div className="form-group-auth">
                        <label><Phone size={16} /> WhatsApp / Celular *</label>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+54 9 11 1234 5678"
                          required
                        />
                      </div>

                      <div className="form-group-auth">
                        <label><Lock size={16} /> Contraseña *</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-auth">
                      <div className="form-group-auth">
                        <label><Cpu size={16} /> Tu Computadora (Modelo/Specs)</label>
                        <input 
                          type="text" 
                          value={device}
                          onChange={(e) => setDevice(e.target.value)}
                          placeholder="Ej. Asus Rog, Ryzen 5, 16GB"
                        />
                      </div>

                      <div className="form-group-auth">
                        <label><Calendar size={16} /> Último Mantenimiento Preventivo</label>
                        <input 
                          type="date" 
                          value={lastMaintenance}
                          onChange={(e) => setLastMaintenance(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="preferences-section">
                      <h4><Bell size={18} /> Suscripción de Novedades y Alertas</h4>
                      <p>Elegí qué tipo de avisos querés recibir por mail o WhatsApp:</p>
                      
                      <div className="pref-item">
                        <input 
                          type="checkbox" 
                          id="pref-maintenance" 
                          checked={maintenanceSub} 
                          onChange={(e) => setMaintenanceSub(e.target.checked)} 
                        />
                        <label htmlFor="pref-maintenance">
                          <strong>Mantenimiento Programado (Recomendado)</strong>
                          <span>Te avisamos cada 6 meses cuando haga falta una limpieza y cambio de pasta térmica para cuidar tus componentes.</span>
                        </label>
                      </div>

                      <div className="pref-item">
                        <input 
                          type="checkbox" 
                          id="pref-offers" 
                          checked={offersSub} 
                          onChange={(e) => setOffersSub(e.target.checked)} 
                        />
                        <label htmlFor="pref-offers">
                          <strong>Ofertas y Promociones Exclusivas</strong>
                          <span>Recibí descuentos especiales en reparaciones y componentes de hardware.</span>
                        </label>
                      </div>

                      <div className="pref-item">
                        <input 
                          type="checkbox" 
                          id="pref-news" 
                          checked={newsSub} 
                          onChange={(e) => setNewsSub(e.target.checked)} 
                        />
                        <label htmlFor="pref-news">
                          <strong>Novedades & Newsletter</strong>
                          <span>Enterate de guías de seguridad, optimización y noticias tecnológicas de nuestro blog.</span>
                        </label>
                      </div>

                      <div className="pref-item">
                        <input 
                          type="checkbox" 
                          id="pref-canje" 
                          checked={canjeSub} 
                          onChange={(e) => setCanjeSub(e.target.checked)} 
                        />
                        <label htmlFor="pref-canje">
                          <strong>Plan Canje & Recambio de Equipamiento</strong>
                          <span>Recibí ofertas personalizadas cuando consideremos que es buen momento para cambiar tu máquina vieja por una notebook nueva.</span>
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-4">Registrarse e Ingresar</button>
                  </form>
                )}
              </div>
            </motion.div>
          ) : (
            /* CLIENT DASHBOARD (LOGGED IN AREA) */
            <motion.div 
              key="client-dashboard"
              className="client-dashboard-grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Left Column: Client Profile & Subscriptions */}
              <div className="client-sidebar">
                <div className="client-profile-card">
                  <div className="client-avatar">
                    <User size={40} />
                  </div>
                  <h3>{loggedClient.name}</h3>
                  <span className="client-email">{loggedClient.email}</span>
                  <span className="client-phone">{loggedClient.phone}</span>

                  <hr className="divider" />

                  <div className="client-device-info">
                    <h4><Cpu size={16} /> Mi Computadora</h4>
                    <p>{loggedClient.device || 'No especificada'}</p>
                  </div>

                  <button onClick={handleLogout} className="btn btn-outline w-100 mt-4 logout-btn">
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>

                <div className="client-preferences-card">
                  <h4>Mis Suscripciones</h4>
                  <div className="sidebar-pref-list">
                    <label className="sidebar-pref-item">
                      <input 
                        type="checkbox" 
                        checked={loggedClient.preferences?.maintenanceSub ?? true} 
                        onChange={(e) => handleUpdatePreferences('maintenanceSub', e.target.checked)} 
                      />
                      <span>Mantenimiento cada 6 meses</span>
                    </label>

                    <label className="sidebar-pref-item">
                      <input 
                        type="checkbox" 
                        checked={loggedClient.preferences?.offersSub ?? true} 
                        onChange={(e) => handleUpdatePreferences('offersSub', e.target.checked)} 
                      />
                      <span>Promociones y Descuentos</span>
                    </label>

                    <label className="sidebar-pref-item">
                      <input 
                        type="checkbox" 
                        checked={loggedClient.preferences?.newsSub ?? true} 
                        onChange={(e) => handleUpdatePreferences('newsSub', e.target.checked)} 
                      />
                      <span>Newsletter mensual</span>
                    </label>

                    <label className="sidebar-pref-item">
                      <input 
                        type="checkbox" 
                        checked={loggedClient.preferences?.canjeSub ?? true} 
                        onChange={(e) => handleUpdatePreferences('canjeSub', e.target.checked)} 
                      />
                      <span>Alertas de Plan Canje</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Repairs tracking & Alerts */}
              <div className="client-main-content">
                {/* 6-Month Maintenance Alert Banner */}
                <div className="maintenance-alert-box" style={{ borderLeft: `5px solid ${maintStatus.color}` }}>
                  <div className="maint-header">
                    <Calendar size={24} style={{ color: maintStatus.color }} />
                    <div>
                      <h4>Próximo Mantenimiento Preventivo</h4>
                      <p style={{ color: maintStatus.color, fontWeight: 'bold' }}>{maintStatus.label}</p>
                    </div>
                  </div>
                  <p className="maint-text mt-2 text-muted">
                    {maintStatus.isOverdue 
                      ? '⚠️ Tu equipo ya superó los 6 meses desde su última limpieza interna. Es sumamente importante realizar el mantenimiento preventivo para evitar sobrecalentamiento y daños permanentes.'
                      : maintStatus.isSoon
                        ? '⏳ Falta poco para los 6 meses de tu último mantenimiento. Te sugerimos ir reservando un turno técnico para la limpieza interna y cambio de pasta térmica.'
                        : '✅ Tu equipo se encuentra en el rango de mantenimiento al día. Te avisaremos automáticamente cuando se cumplan los 6 meses.'}
                  </p>
                  {(maintStatus.isOverdue || maintStatus.isSoon) && (
                    <a 
                      href={`https://wa.me/5491112345678?text=Hola! Soy ${loggedClient.name} y me gustaría agendar un turno para el mantenimiento preventivo de mi equipo (${loggedClient.device}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mt-2"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      Solicitar Turno por WhatsApp
                    </a>
                  )}
                </div>

                {/* Repairs Tracking Section */}
                <div className="client-repairs-card">
                  <div className="card-header-tracking">
                    <Wrench size={20} className="text-primary" />
                    <h3>Estado de mis Reparaciones</h3>
                  </div>

                  {isLoadingTickets ? (
                    <div className="text-center py-4">Cargando órdenes de servicio...</div>
                  ) : clientTickets.length === 0 ? (
                    <div className="empty-repairs-state">
                      <Notebook size={32} className="text-muted" />
                      <p>No tenés ninguna reparación activa registrada a tu nombre.</p>
                      <p className="subtext">Si dejaste un equipo en laboratorio, asegurate de que tu nombre de registro coincida con el de la orden de servicio, o consultá usando el buscador público en <a href="/seguimiento">Seguimiento</a>.</p>
                    </div>
                  ) : (
                    <div className="client-tickets-list">
                      {clientTickets.map(ticket => (
                        <div key={ticket.ticketId} className="client-ticket-item">
                          <div className="ticket-item-header">
                            <div>
                              <strong>Orden: {ticket.ticketId}</strong>
                              <span className="device-tag">{ticket.device}</span>
                            </div>
                            <span className="step-badge">Fase {ticket.currentStep}/6: {ticket.currentStep === 6 ? 'Entregado' : 'En laboratorio'}</span>
                          </div>
                          
                          <div className="ticket-item-body mt-2">
                            <p><strong>Ingreso:</strong> {ticket.entryDate} | <strong>Entrega Estimada:</strong> {ticket.estimatedDelivery}</p>
                            <p className="mt-1"><strong>Diagnóstico inicial:</strong> {ticket.description}</p>
                            {ticket.statusNotes && (
                              <div className="ticket-notes mt-2">
                                <strong>Nota técnica:</strong> {ticket.statusNotes}
                              </div>
                            )}
                          </div>
                          
                          <div className="ticket-progress-bar-container mt-3">
                            <div className="progress-bar-labels">
                              <span>Recibido</span>
                              <span>Diagnóstico</span>
                              <span>Listo</span>
                            </div>
                            <div className="bar-bg">
                              <div 
                                className="bar-fill" 
                                style={{ width: `${((ticket.currentStep - 1) / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Offers & Equipment Change */}
                <div className="client-marketing-offers-grid mt-4">
                  <div className="marketing-promo-card">
                    <Gift size={24} className="text-primary" />
                    <h4>Oferta Especial</h4>
                    <p>15% de descuento en la compra de tu disco SSD de 1TB para actualizar tu equipo.</p>
                    <a href="/tienda" className="link-action mt-2">Ver componentes en Tienda</a>
                  </div>

                  <div className="marketing-promo-card">
                    <RefreshCw size={24} className="text-primary" />
                    <h4>Plan Canje Activo</h4>
                    <p>Cotizá tu computadora usada para llevarte una Notebook HP Pavilion de última generación en cuotas.</p>
                    <a href="/cotizacion" state={{ selectType: 'canje' }} className="link-action mt-2">Cotizar mi Canje</a>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Auth;
