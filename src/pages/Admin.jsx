import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Trash2, 
  Edit, 
  Plus, 
  LogOut, 
  ShoppingBag, 
  Wrench, 
  Save, 
  X, 
  Clock
} from 'lucide-react';
import { CONFIG } from '../config';
import { 
  getDbProducts, 
  saveDbProduct, 
  deleteDbProduct, 
  getDbTickets, 
  saveDbTicket, 
  deleteDbTicket, 
  isFirebaseConfigured 
} from '../firebase';
import './Admin.css';

const CATEGORIES = [
  "Nuevas", "Usadas", "Gamer", "Oficina", "Hogar", "Notebooks", "Escritorio", "All in one",
  "Componentes", "Periféricos", "Monitores", "Teclados", "Parlantes", "Componentes pc", "Combos actualización"
];

const STEPS = [
  { step: 1, label: "Recibido" },
  { step: 2, label: "Diagnóstico" },
  { step: 3, label: "Presupuesto" },
  { step: 4, label: "En Reparación" },
  { step: 5, label: "Pruebas" },
  { step: 6, label: "Listo" }
];

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('rtc_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'store' or 'tracking'
  const [activeTab, setActiveTab] = useState('store');

  // Load products & tickets from database/localStorage
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load data upon mounting if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const prodData = await getDbProducts();
        const tickData = await getDbTickets();
        setProducts(prodData);
        setTickets(tickData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Editor states (Store)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Gamer');
  const [prodImg, setProdImg] = useState('');
  const [prodCondition, setProdCondition] = useState('Nuevo');
  const [prodWarranty, setProdWarranty] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodSpecs, setProdSpecs] = useState('');

  // Editor states (Tracking)
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [tickId, setTickId] = useState('');
  const [tickClient, setTickClient] = useState('');
  const [tickDevice, setTickDevice] = useState('');
  const [tickEntryDate, setTickEntryDate] = useState('');
  const [tickDelivery, setTickDelivery] = useState('');
  const [tickDesc, setTickDesc] = useState('');
  const [tickStep, setTickStep] = useState(1);
  const [tickNotes, setTickNotes] = useState('');
  const [newHistoryLabel, setNewHistoryLabel] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CONFIG.adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rtc_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Intentalo nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rtc_admin_auth');
  };

  // STORE OPERATIONS
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdCategory('Gamer');
    setProdImg('https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');
    setProdCondition('Nuevo');
    setProdWarranty('12 meses de garantía');
    setProdStock('Disponible (Inmediato)');
    setProdSpecs('Procesador\nMemoria RAM\nAlmacenamiento');
    setIsProductFormOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdCategory(prod.category);
    setProdImg(prod.img);
    setProdCondition(prod.condition);
    setProdWarranty(prod.warranty);
    setProdStock(prod.stock);
    setProdSpecs(prod.specs.join('\n'));
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const specsArray = prodSpecs.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    const productData = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: prodName,
      price: Number(prodPrice),
      category: prodCategory,
      img: prodImg,
      condition: prodCondition,
      warranty: prodWarranty,
      stock: prodStock,
      specs: specsArray
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      setProducts([productData, ...products]);
    }
    
    setIsProductFormOpen(false);
    await saveDbProduct(productData);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
      await deleteDbProduct(id);
    }
  };

  // TRACKING OPERATIONS
  const openAddTicket = () => {
    setEditingTicket(null);
    const nextNum = Object.keys(tickets).length + 1001;
    setTickId(`RTC-${nextNum}`);
    setTickClient('');
    setTickDevice('');
    setTickEntryDate(new Date().toLocaleDateString('es-AR'));
    setTickDelivery('En diagnóstico (2-3 días)');
    setTickDesc('Falla en encendido / lentitud');
    setTickStep(1);
    setTickNotes('Equipo ingresado en cola de diagnóstico.');
    setNewHistoryLabel('');
    setIsTicketFormOpen(true);
  };

  const openEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setTickId(ticket.ticketId);
    setTickClient(ticket.clientName);
    setTickDevice(ticket.device);
    setTickEntryDate(ticket.entryDate);
    setTickDelivery(ticket.estimatedDelivery);
    setTickDesc(ticket.description);
    setTickStep(ticket.currentStep);
    setTickNotes(ticket.statusNotes);
    setNewHistoryLabel('');
    setIsTicketFormOpen(true);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    const cleanId = tickId.trim().toUpperCase();

    const formattedHistory = editingTicket 
      ? [...editingTicket.history]
      : [{ step: 1, date: `${tickEntryDate} ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`, label: "Equipo recibido en sucursal" }];

    if (newHistoryLabel.trim()) {
      const now = new Date();
      const dateStr = `${now.toLocaleDateString('es-AR')} ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
      formattedHistory.push({
        step: tickStep,
        date: dateStr,
        label: newHistoryLabel.trim()
      });
    }

    const updatedTicket = {
      ticketId: cleanId,
      clientName: tickClient,
      device: tickDevice,
      entryDate: tickEntryDate,
      estimatedDelivery: tickDelivery,
      description: tickDesc,
      currentStep: Number(tickStep),
      priceEstimate: "Sujeto a diagnóstico final",
      statusNotes: tickNotes,
      history: formattedHistory
    };

    setTickets({ ...tickets, [cleanId]: updatedTicket });
    setIsTicketFormOpen(false);
    await saveDbTicket(updatedTicket);
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar el ticket ${id}?`)) {
      const updated = { ...tickets };
      delete updated[id];
      setTickets(updated);
      await deleteDbTicket(id);
    }
  };

  const getStepLabel = (stepNum) => {
    return STEPS.find(s => s.step === stepNum)?.label || 'Desconocido';
  };

  return (
    <>
      <Helmet>
        <title>Panel de Administración | Reparo Tu Compu</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* LOGIN PAGE */}
      {!isAuthenticated ? (
        <div className="admin-login-overlay">
          <motion.div 
            className="admin-login-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="lock-icon-circle">
              <Lock size={32} />
            </div>
            <h2>Acceso de Administración</h2>
            <p>Ingresá la contraseña de seguridad para acceder al panel de control.</p>
            
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group-admin">
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {authError && <span className="auth-error-msg">{authError}</span>}
              <button type="submit" className="btn btn-primary w-100 mt-2">Ingresar al Panel</button>
            </form>
          </motion.div>
        </div>
      ) : (
        
        // ADMIN DASHBOARD
        <div className="admin-dashboard-layout container">
          
          {/* Header */}
          <div className="admin-dashboard-header">
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="admin-badge"><Unlock size={14} /> ADMIN ACTIVO</span>
                <span className={`admin-badge ${isFirebaseConfigured ? 'db-online' : 'db-local'}`}>
                  {isFirebaseConfigured ? '🔥 FIREBASE CONECTADO' : '💾 MODO LOCALSTORAGE'}
                </span>
              </div>
              <h2>Panel de Control General</h2>
            </div>
            <button onClick={handleLogout} className="btn btn-outline sign-out-btn">
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>

          {isLoadingData ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="admin-content-box text-center py-5"
              style={{ color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}
            >
              <div className="loading-spinner"></div>
              <p>Cargando datos desde la base de datos...</p>
            </motion.div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <div className="admin-tabs">
                <button 
                  className={`admin-tab-btn ${activeTab === 'store' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('store'); setIsProductFormOpen(false); }}
                >
                  <ShoppingBag size={18} /> Gestionar Tienda ({products.length})
                </button>
                <button 
                  className={`admin-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('tracking'); setIsTicketFormOpen(false); }}
                >
                  <Wrench size={18} /> Gestionar Reparaciones ({Object.keys(tickets).length})
                </button>
              </div>

              {/* TAB 1: GESTIÓN DE TIENDA */}
              {activeTab === 'store' && (
                <div className="admin-content-box">
                  <div className="table-actions">
                    <h3>Listado de Productos</h3>
                    <button className="btn btn-primary" onClick={openAddProduct}>
                      <Plus size={16} /> Agregar Producto
                    </button>
                  </div>

                  {/* Product Form Card (Collapsible) */}
                  <AnimatePresence>
                    {isProductFormOpen && (
                      <motion.div 
                        className="admin-form-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="form-card-header-admin">
                          <h4>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h4>
                          <button onClick={() => setIsProductFormOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="admin-editor-form">
                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Nombre del Producto</label>
                              <input 
                                type="text" 
                                value={prodName} 
                                onChange={(e) => setProdName(e.target.value)} 
                                placeholder="Ej. Placa de video RTX 4060" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Precio (USD)</label>
                              <input 
                                type="number" 
                                value={prodPrice} 
                                onChange={(e) => setProdPrice(e.target.value)} 
                                placeholder="Ej. 450" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Categoría</label>
                              <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                                {CATEGORIES.map((cat, idx) => (
                                  <option key={idx} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group-admin">
                              <label>Estado</label>
                              <select value={prodCondition} onChange={(e) => setProdCondition(e.target.value)}>
                                <option value="Nuevo">Nuevo</option>
                                <option value="Usado - Excelente estado">Usado - Excelente estado</option>
                                <option value="Reacondicionado">Reacondicionado</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Garantía</label>
                              <input 
                                type="text" 
                                value={prodWarranty} 
                                onChange={(e) => setProdWarranty(e.target.value)} 
                                placeholder="Ej. 12 meses oficial" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Stock / Disponibilidad</label>
                              <input 
                                type="text" 
                                value={prodStock} 
                                onChange={(e) => setProdStock(e.target.value)} 
                                placeholder="Ej. Disponible (Inmediato)" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-group-admin">
                            <label>URL de Imagen</label>
                            <input 
                              type="text" 
                              value={prodImg} 
                              onChange={(e) => setProdImg(e.target.value)} 
                              placeholder="Link de la imagen" 
                              required 
                            />
                          </div>

                          <div className="form-group-admin">
                            <label>Especificaciones Técnicas (Una por línea)</label>
                            <textarea 
                              rows="5" 
                              value={prodSpecs} 
                              onChange={(e) => setProdSpecs(e.target.value)}
                              placeholder="Ej.&#10;Intel i5 12400F&#10;16GB RAM DDR4&#10;SSD NVMe 500GB"
                              required
                            ></textarea>
                          </div>

                          <div className="form-actions-admin">
                            <button type="button" className="btn btn-outline" onClick={() => setIsProductFormOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Guardar Producto</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Products Table */}
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Imagen</th>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(prod => (
                          <tr key={prod.id}>
                            <td className="col-img">
                              <img src={prod.img} alt={prod.name} className="admin-table-thumb" />
                            </td>
                            <td className="col-title">
                              <strong>{prod.name}</strong>
                              <span className="table-subtext">{prod.stock}</span>
                            </td>
                            <td>{prod.category}</td>
                            <td className="price-td">${prod.price}</td>
                            <td><span className={`badge-cond ${prod.condition.toLowerCase().includes('nuevo') ? 'cond-new' : 'cond-used'}`}>{prod.condition}</span></td>
                            <td className="col-actions">
                              <button onClick={() => openEditProduct(prod)} className="table-btn edit-btn" title="Editar"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteProduct(prod.id)} className="table-btn delete-btn" title="Eliminar"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: GESTIÓN DE REPARACIONES */}
              {activeTab === 'tracking' && (
                <div className="admin-content-box">
                  <div className="table-actions">
                    <h3>Listado de Equipos en Servicio</h3>
                    <button className="btn btn-primary" onClick={openAddTicket}>
                      <Plus size={16} /> Crear Nueva Orden
                    </button>
                  </div>

                  {/* Ticket Form Card */}
                  <AnimatePresence>
                    {isTicketFormOpen && (
                      <motion.div 
                        className="admin-form-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="form-card-header-admin">
                          <h4>{editingTicket ? `Editar Orden: ${tickId}` : 'Crear Nueva Orden de Servicio'}</h4>
                          <button onClick={() => setIsTicketFormOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleTicketSubmit} className="admin-editor-form">
                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Código de Orden / Ticket</label>
                              <input 
                                type="text" 
                                value={tickId} 
                                onChange={(e) => setTickId(e.target.value)} 
                                placeholder="Ej. RTC-1002" 
                                required 
                                disabled={!!editingTicket}
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Nombre del Cliente</label>
                              <input 
                                type="text" 
                                value={tickClient} 
                                onChange={(e) => setTickClient(e.target.value)} 
                                placeholder="Ej. Juan Pérez" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Equipo / Dispositivo</label>
                              <input 
                                type="text" 
                                value={tickDevice} 
                                onChange={(e) => setTickDevice(e.target.value)} 
                                placeholder="Ej. Notebook Asus X415" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Fecha de Ingreso</label>
                              <input 
                                type="text" 
                                value={tickEntryDate} 
                                onChange={(e) => setTickEntryDate(e.target.value)} 
                                placeholder="DD/MM/AAAA" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Entrega Estimada</label>
                              <input 
                                type="text" 
                                value={tickDelivery} 
                                onChange={(e) => setTickDelivery(e.target.value)} 
                                placeholder="Ej. 24/07/2026 o Listo" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Fase de Estado</label>
                              <select value={tickStep} onChange={(e) => setTickStep(Number(e.target.value))}>
                                {STEPS.map((s) => (
                                  <option key={s.step} value={s.step}>{s.step}: {s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-group-admin">
                            <label>Falla Reportada</label>
                            <input 
                              type="text" 
                              value={tickDesc} 
                              onChange={(e) => setTickDesc(e.target.value)} 
                              placeholder="Descripción breve de la falla" 
                              required 
                            />
                          </div>

                          <div className="form-group-admin">
                            <label>Nota Técnica Actual</label>
                            <textarea 
                              rows="3" 
                              value={tickNotes} 
                              onChange={(e) => setTickNotes(e.target.value)}
                              placeholder="Actualización técnica de la fase..."
                              required
                            ></textarea>
                          </div>

                          {/* Add new history log */}
                          <div className="form-group-admin history-addition-box">
                            <label>Registrar Nueva Actividad (Opcional - se añade al historial)</label>
                            <div className="history-input-row">
                              <Clock size={18} className="history-icon-helper" />
                              <input 
                                type="text" 
                                value={newHistoryLabel}
                                onChange={(e) => setNewHistoryLabel(e.target.value)}
                                placeholder="Ej. Presupuesto aceptado por el cliente, esperando repuestos..."
                              />
                            </div>
                          </div>

                          <div className="form-actions-admin">
                            <button type="button" className="btn btn-outline" onClick={() => setIsTicketFormOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Guardar Orden</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tickets Table */}
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Cliente</th>
                          <th>Dispositivo</th>
                          <th>Fecha Ingreso</th>
                          <th>Paso Actual</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(tickets).map(tick => (
                          <tr key={tick.ticketId}>
                            <td><span className="table-ticket-code">{tick.ticketId}</span></td>
                            <td><strong>{tick.clientName}</strong></td>
                            <td>{tick.device}</td>
                            <td>{tick.entryDate}</td>
                            <td>
                              <span className={`badge-step step-${tick.currentStep}`}>
                                {tick.currentStep}: {getStepLabel(tick.currentStep)}
                              </span>
                            </td>
                            <td className="col-actions">
                              <button onClick={() => openEditTicket(tick)} className="table-btn edit-btn" title="Editar"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteTicket(tick.ticketId)} className="table-btn delete-btn" title="Eliminar"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}
    </>
  );
};

export default Admin;
