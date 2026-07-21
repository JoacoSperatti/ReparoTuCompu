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
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  Users,
  Mail,
  Gift
} from 'lucide-react';
import { CONFIG } from '../config';
import { 
  getDbProducts, 
  saveDbProduct, 
  deleteDbProduct, 
  getDbTickets, 
  saveDbTicket, 
  deleteDbTicket, 
  getDbTestimonials,
  saveDbTestimonial,
  deleteDbTestimonial,
  getDbClients,
  saveDbClient,
  deleteDbClient,
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

  // Custom Alerts / Confirms state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    variant: 'info', // 'info' | 'success' | 'danger' | 'warning'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const showAlert = (title, message, variant = 'info') => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        variant,
        title,
        message,
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: null
      });
    });
  };

  const showConfirm = (title, message, variant = 'warning') => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        type: 'confirm',
        variant,
        title,
        message,
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  // Active Tab: 'store', 'tracking' or 'testimonials'
  const [activeTab, setActiveTab] = useState('store');

  // Load products, tickets, testimonials & clients from database/localStorage
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load data upon mounting if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const prodData = await getDbProducts();
        const tickData = await getDbTickets();
        const testData = await getDbTestimonials();
        const clientData = await getDbClients();
        setProducts(prodData);
        setTickets(tickData);
        setTestimonials(testData);
        setClients(clientData);
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

  // Editor states (Testimonials)
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testName, setTestName] = useState('');
  const [testService, setTestService] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testComment, setTestComment] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testVisible, setTestVisible] = useState(true);
  const [testPosition, setTestPosition] = useState(0);

  // Editor states (Clients)
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [cliName, setCliName] = useState('');
  const [cliEmail, setCliEmail] = useState('');
  const [cliPhone, setCliPhone] = useState('');
  const [cliDevice, setCliDevice] = useState('');
  const [cliLastMaint, setCliLastMaint] = useState('');
  const [cliMaintSub, setCliMaintSub] = useState(true);
  const [cliOffersSub, setCliOffersSub] = useState(true);
  const [cliNewsSub, setCliNewsSub] = useState(true);
  const [cliCanjeSub, setCliCanjeSub] = useState(true);
  const [cliPassword, setCliPassword] = useState('123456');

  // Client Filter states
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientSubFilter, setClientSubFilter] = useState('all');

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
    showAlert(
      editingProduct ? 'Producto actualizado' : 'Producto creado',
      `El producto "${prodName}" se guardó con éxito en la tienda.`,
      'success'
    );
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = await showConfirm(
      '¿Eliminar producto?',
      'Esta acción no se puede deshacer. ¿Estás seguro de que querés eliminar este producto?',
      'danger'
    );
    if (confirmed) {
      setProducts(products.filter(p => p.id !== id));
      await deleteDbProduct(id);
      showAlert('Producto eliminado', 'El producto fue eliminado exitosamente.', 'success');
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
      priceEstimate: editingTicket ? editingTicket.priceEstimate : "Sujeto a diagnóstico final",
      statusNotes: tickNotes,
      history: formattedHistory
    };

    setTickets({ ...tickets, [cleanId]: updatedTicket });
    setIsTicketFormOpen(false);
    await saveDbTicket(updatedTicket);
    showAlert(
      editingTicket ? 'Ticket actualizado' : 'Ticket creado',
      `El ticket de reparación ${cleanId} fue guardado correctamente.`,
      'success'
    );
  };

  const handleDeleteTicket = async (id) => {
    const confirmed = await showConfirm(
      '¿Eliminar ticket?',
      `Esta acción no se puede deshacer. ¿Estás seguro de que querés eliminar el ticket ${id}?`,
      'danger'
    );
    if (confirmed) {
      const updated = { ...tickets };
      delete updated[id];
      setTickets(updated);
      await deleteDbTicket(id);
      showAlert('Ticket eliminado', `El ticket ${id} fue eliminado correctamente.`, 'success');
    }
  };

  const getStepLabel = (stepNum) => {
    return STEPS.find(s => s.step === stepNum)?.label || 'Desconocido';
  };

  // TESTIMONIALS OPERATIONS
  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestName('');
    setTestService('');
    setTestRating(5);
    setTestComment('');
    setTestDate(new Date().toLocaleDateString('es-AR'));
    setTestVisible(true);
    const maxPos = testimonials.reduce((max, t) => Math.max(max, t.position || 0), 0);
    setTestPosition(maxPos + 1);
    setIsTestimonialFormOpen(true);
  };

  const openEditTestimonial = (test) => {
    setEditingTestimonial(test);
    setTestName(test.name);
    setTestService(test.service);
    setTestRating(test.rating);
    setTestComment(test.comment);
    setTestDate(test.date);
    setTestVisible(test.visible !== false);
    setTestPosition(test.position || 0);
    setIsTestimonialFormOpen(true);
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    const testimonialData = {
      id: editingTestimonial ? editingTestimonial.id : Date.now(),
      name: testName,
      service: testService,
      rating: Number(testRating),
      comment: testComment,
      date: testDate,
      visible: testVisible,
      position: Number(testPosition)
    };

    let updatedTestimonials;
    if (editingTestimonial) {
      updatedTestimonials = testimonials.map(t => t.id === editingTestimonial.id ? testimonialData : t);
    } else {
      updatedTestimonials = [testimonialData, ...testimonials];
    }
    
    updatedTestimonials.sort((a, b) => {
      const posA = a.position !== undefined ? Number(a.position) : 9999;
      const posB = b.position !== undefined ? Number(b.position) : 9999;
      if (posA !== posB) return posA - posB;
      return Number(b.id) - Number(a.id);
    });

    setTestimonials(updatedTestimonials);
    setIsTestimonialFormOpen(false);
    await saveDbTestimonial(testimonialData);
    showAlert(
      editingTestimonial ? 'Opinión actualizada' : 'Opinión creada',
      `La opinión de "${testName}" se guardó con éxito.`,
      'success'
    );
  };

  const handleDeleteTestimonial = async (id) => {
    const confirmed = await showConfirm(
      '¿Eliminar opinión?',
      'Esta acción no se puede deshacer. ¿Estás seguro de que querés eliminar esta opinión?',
      'danger'
    );
    if (confirmed) {
      setTestimonials(testimonials.filter(t => t.id !== id));
      await deleteDbTestimonial(id);
      showAlert('Opinión eliminada', 'La opinión fue eliminada exitosamente.', 'success');
    }
  };

  const handleToggleVisibility = async (test) => {
    const updatedTest = { ...test, visible: test.visible === false ? true : false };
    setTestimonials(testimonials.map(t => t.id === test.id ? updatedTest : t));
    await saveDbTestimonial(updatedTest);
  };

  const handleUpdatePosition = async (test, newPos) => {
    const posNum = Number(newPos);
    if (isNaN(posNum)) return;
    const updatedTest = { ...test, position: posNum };
    const updatedList = testimonials.map(t => t.id === test.id ? updatedTest : t);
    
    updatedList.sort((a, b) => {
      const posA = a.position !== undefined ? Number(a.position) : 9999;
      const posB = b.position !== undefined ? Number(b.position) : 9999;
      if (posA !== posB) return posA - posB;
      return Number(b.id) - Number(a.id);
    });

    setTestimonials(updatedList);
    await saveDbTestimonial(updatedTest);
  };

  // CLIENTS OPERATIONS
  const openAddClient = () => {
    setEditingClient(null);
    setCliName('');
    setCliEmail('');
    setCliPhone('');
    setCliDevice('');
    setCliLastMaint(new Date().toISOString().split('T')[0]);
    setCliMaintSub(true);
    setCliOffersSub(true);
    setCliNewsSub(true);
    setCliCanjeSub(true);
    setCliPassword('123456');
    setIsClientFormOpen(true);
  };

  const openEditClient = (client) => {
    setEditingClient(client);
    setCliName(client.name);
    setCliEmail(client.email);
    setCliPhone(client.phone);
    setCliDevice(client.device);
    setCliLastMaint(client.lastMaintenance || '');
    setCliMaintSub(client.preferences?.maintenanceSub !== false);
    setCliOffersSub(client.preferences?.offersSub !== false);
    setCliNewsSub(client.preferences?.newsSub !== false);
    setCliCanjeSub(client.preferences?.canjeSub !== false);
    setCliPassword(client.password || '123456');
    setIsClientFormOpen(true);
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (!cliName.trim() || !cliEmail.trim() || !cliPhone.trim()) {
      showAlert('Error', 'Nombre, Correo y WhatsApp son campos requeridos.', 'danger');
      return;
    }

    const clientData = {
      id: editingClient ? editingClient.id : Date.now(),
      name: cliName.trim(),
      email: cliEmail.trim().toLowerCase(),
      phone: cliPhone.trim(),
      device: cliDevice.trim() || 'No especificado',
      password: cliPassword || '123456',
      lastMaintenance: cliLastMaint || new Date().toISOString().split('T')[0],
      preferences: {
        maintenanceSub: cliMaintSub,
        offersSub: cliOffersSub,
        newsSub: cliNewsSub,
        canjeSub: cliCanjeSub
      },
      registeredAt: editingClient ? editingClient.registeredAt : new Date().toLocaleDateString('es-AR')
    };

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? clientData : c));
    } else {
      setClients([clientData, ...clients]);
    }

    setIsClientFormOpen(false);
    await saveDbClient(clientData);
    showAlert(
      editingClient ? 'Cliente actualizado' : 'Cliente registrado',
      `El cliente "${cliName}" se guardó con éxito.`,
      'success'
    );
  };

  const handleDeleteClient = async (id) => {
    const confirmed = await showConfirm(
      '¿Eliminar cliente?',
      'Esta acción no se puede deshacer. ¿Estás seguro de que querés eliminar a este cliente?',
      'danger'
    );
    if (confirmed) {
      setClients(clients.filter(c => c.id !== id));
      await deleteDbClient(id);
      showAlert('Cliente eliminado', 'El cliente fue eliminado exitosamente.', 'success');
    }
  };

  const handleRecordMaintenance = async (client) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedClient = {
      ...client,
      lastMaintenance: todayStr
    };

    setClients(clients.map(c => c.id === client.id ? updatedClient : c));
    await saveDbClient(updatedClient);
    showAlert(
      'Mantenimiento Registrado',
      `Se registró el mantenimiento hoy (${new Date().toLocaleDateString('es-AR')}) para ${client.name}.`,
      'success'
    );
  };

  const sendMarketingTemplate = (client, channel, templateType) => {
    const name = client.name;
    const device = client.device || 'tu equipo';
    const phoneClean = client.phone.replace(/[^0-9]/g, ''); // Keep only numbers
    
    let text = '';
    let subject = '';

    if (templateType === 'maintenance') {
      subject = 'Recordatorio de mantenimiento preventivo - Reparo Tu Compu';
      text = `Hola ${name}! Te escribimos de Reparo Tu Compu. Notamos que ya pasaron 6 meses desde el último mantenimiento preventivo de tu ${device}. Te recomendamos realizar una limpieza interna y cambio de pasta térmica para mantener las temperaturas bajas y extender la vida útil de tus componentes. ¿Te gustaría coordinar un turno para esta semana?`;
    } else if (templateType === 'promotion') {
      subject = 'Oferta exclusiva de temporada - Reparo Tu Compu';
      text = `Hola ${name}! Te escribimos de Reparo Tu Compu para contarte que tenés disponible un descuento exclusivo del 15% en mano de obra para cualquier servicio técnico o actualización de componentes en tu ${device}. ¡Aprovechalo esta semana!`;
    } else if (templateType === 'news') {
      subject = 'Newsletter Mensual - Reparo Tu Compu';
      text = `Hola ${name}! Te compartimos nuestro newsletter mensual de Reparo Tu Compu. Este mes te traemos consejos para optimizar el rendimiento de Windows, seguridad ante malware y nuevas configuraciones gamer recomendadas. ¡Podes ver todo en nuestra web!`;
    } else if (templateType === 'canje') {
      subject = 'Plan Canje de Equipamiento - Reparo Tu Compu';
      text = `Hola ${name}! Esperamos que estés bien. Queríamos comentarte que tu ${device} califica para nuestro Plan Canje de equipos. Podés entregarlo como parte de pago y llevarte una notebook nueva o PC de escritorio actualizada con garantía escrita. ¿Te interesa recibir una cotización aproximada?`;
    }

    if (channel === 'whatsapp') {
      const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      const url = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
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
                  onClick={() => { setActiveTab('store'); setIsProductFormOpen(false); setIsTestimonialFormOpen(false); setIsClientFormOpen(false); }}
                >
                  <ShoppingBag size={18} /> Gestionar Tienda ({products.length})
                </button>
                <button 
                  className={`admin-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('tracking'); setIsTicketFormOpen(false); setIsTestimonialFormOpen(false); setIsClientFormOpen(false); }}
                >
                  <Wrench size={18} /> Gestionar Reparaciones ({Object.keys(tickets).length})
                </button>
                <button 
                  className={`admin-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('testimonials'); setIsProductFormOpen(false); setIsTicketFormOpen(false); setIsClientFormOpen(false); }}
                >
                  <MessageSquare size={18} /> Gestionar Opiniones ({testimonials.length})
                </button>
                <button 
                  className={`admin-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('clients'); setIsProductFormOpen(false); setIsTicketFormOpen(false); setIsTestimonialFormOpen(false); setIsClientFormOpen(false); }}
                >
                  <Users size={18} /> Gestionar Clientes ({clients.length})
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

              {/* TAB 3: GESTIÓN DE OPINIONES */}
              {activeTab === 'testimonials' && (
                <div className="admin-content-box">
                  <div className="table-actions">
                    <h3>Listado de Opiniones de Clientes</h3>
                    <button className="btn btn-primary" onClick={openAddTestimonial}>
                      <Plus size={16} /> Agregar Opinión
                    </button>
                  </div>

                  {/* Testimonial Form Card (Collapsible) */}
                  <AnimatePresence>
                    {isTestimonialFormOpen && (
                      <motion.div 
                        className="admin-form-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="form-card-header-admin">
                          <h4>{editingTestimonial ? 'Editar Opinión' : 'Nueva Opinión'}</h4>
                          <button onClick={() => setIsTestimonialFormOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleTestimonialSubmit} className="admin-editor-form">
                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Nombre del Cliente</label>
                              <input 
                                type="text" 
                                value={testName} 
                                onChange={(e) => setTestName(e.target.value)} 
                                placeholder="Ej. Diego Fernández" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Servicio / Trabajo Realizado</label>
                              <input 
                                type="text" 
                                value={testService} 
                                onChange={(e) => setTestService(e.target.value)} 
                                placeholder="Ej. Reparación de Notebook HP" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Calificación (Estrellas 1-5)</label>
                              <select value={testRating} onChange={(e) => setTestRating(Number(e.target.value))}>
                                <option value={5}>5 Estrellas</option>
                                <option value={4}>4 Estrellas</option>
                                <option value={3}>3 Estrellas</option>
                                <option value={2}>2 Estrellas</option>
                                <option value={1}>1 Estrella</option>
                              </select>
                            </div>
                            <div className="form-group-admin">
                              <label>Fecha de la opinión</label>
                              <input 
                                type="text" 
                                value={testDate} 
                                onChange={(e) => setTestDate(e.target.value)} 
                                placeholder="DD/MM/AAAA" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Posición en la lista</label>
                              <input 
                                type="number" 
                                value={testPosition} 
                                onChange={(e) => setTestPosition(e.target.value)} 
                                placeholder="Ej. 1 (menor número = aparece primero)" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <label style={{ marginBottom: '0.5rem' }}>Visibilidad en Web</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input 
                                  type="checkbox" 
                                  id="testVisibleCheckbox"
                                  checked={testVisible} 
                                  onChange={(e) => setTestVisible(e.target.checked)}
                                  style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                />
                                <label htmlFor="testVisibleCheckbox" style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
                                  Visible para el público
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group-admin">
                            <label>Comentario / Opinión</label>
                            <textarea 
                              rows="4" 
                              value={testComment} 
                              onChange={(e) => setTestComment(e.target.value)}
                              placeholder="Escribí el comentario del cliente..."
                              required
                            ></textarea>
                          </div>

                          <div className="form-actions-admin">
                            <button type="button" className="btn btn-outline" onClick={() => setIsTestimonialFormOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Guardar Opinión</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Testimonials Table */}
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Posición</th>
                          <th>Cliente</th>
                          <th>Servicio</th>
                          <th>Comentario</th>
                          <th>Calificación</th>
                          <th>Visibilidad</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map(test => (
                          <tr key={test.id}>
                            <td className="col-position" style={{ width: '90px' }}>
                              <input 
                                type="number" 
                                value={test.position !== undefined ? test.position : ''} 
                                onChange={(e) => handleUpdatePosition(test, e.target.value)}
                                className="admin-pos-input"
                                style={{
                                  width: '60px',
                                  padding: '0.25rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--color-border)',
                                  background: 'var(--color-bg-alt)',
                                  color: 'var(--color-text)',
                                  textAlign: 'center'
                                }}
                              />
                            </td>
                            <td>
                              <strong>{test.name}</strong>
                              <span className="table-subtext">{test.date}</span>
                            </td>
                            <td>{test.service}</td>
                            <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={test.comment}>
                              {test.comment}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '2px', color: '#ffb400' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    fill={i < test.rating ? "#ffb400" : "none"} 
                                    stroke={i < test.rating ? "#ffb400" : "currentColor"} 
                                  />
                                ))}
                              </div>
                            </td>
                            <td>
                              <button 
                                onClick={() => handleToggleVisibility(test)} 
                                className={`table-btn ${test.visible !== false ? 'edit-btn' : 'delete-btn'}`}
                                title={test.visible !== false ? "Ocultar en la web" : "Mostrar en la web"}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                              >
                                {test.visible !== false ? (
                                  <>
                                    <Eye size={16} /> <span>Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={16} /> <span style={{ opacity: 0.6 }}>Oculto</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="col-actions">
                              <button onClick={() => openEditTestimonial(test)} className="table-btn edit-btn" title="Editar"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteTestimonial(test.id)} className="table-btn delete-btn" title="Eliminar"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GESTIÓN DE CLIENTES */}
              {activeTab === 'clients' && (
                <div className="admin-content-box">
                  <div className="table-actions">
                    <h3>Listado de Clientes ({clients.length})</h3>
                    <button className="btn btn-primary" onClick={openAddClient}>
                      <Plus size={16} /> Registrar Cliente
                    </button>
                  </div>

                  {/* Client Form Card (Collapsible) */}
                  <AnimatePresence>
                    {isClientFormOpen && (
                      <motion.div 
                        className="admin-form-container"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="form-card-header-admin">
                          <h4>{editingClient ? `Editar Cliente: ${cliName}` : 'Registrar Nuevo Cliente'}</h4>
                          <button onClick={() => setIsClientFormOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleClientSubmit} className="admin-editor-form">
                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Nombre y Apellido *</label>
                              <input 
                                type="text" 
                                value={cliName} 
                                onChange={(e) => setCliName(e.target.value)} 
                                placeholder="Juan Pérez" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Correo Electrónico *</label>
                              <input 
                                type="email" 
                                value={cliEmail} 
                                onChange={(e) => setCliEmail(e.target.value)} 
                                placeholder="juan@correo.com" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>WhatsApp / Teléfono *</label>
                              <input 
                                type="text" 
                                value={cliPhone} 
                                onChange={(e) => setCliPhone(e.target.value)} 
                                placeholder="+54 9 11 1234 5678" 
                                required 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Contraseña Acceso *</label>
                              <input 
                                type="text" 
                                value={cliPassword} 
                                onChange={(e) => setCliPassword(e.target.value)} 
                                placeholder="Contraseña de cliente" 
                                required 
                              />
                            </div>
                          </div>

                          <div className="form-row-admin">
                            <div className="form-group-admin">
                              <label>Computadora / Hardware</label>
                              <input 
                                type="text" 
                                value={cliDevice} 
                                onChange={(e) => setCliDevice(e.target.value)} 
                                placeholder="Ej. Notebook Lenovo Thinkpad" 
                              />
                            </div>
                            <div className="form-group-admin">
                              <label>Último Mantenimiento Preventivo</label>
                              <input 
                                type="date" 
                                value={cliLastMaint} 
                                onChange={(e) => setCliLastMaint(e.target.value)} 
                              />
                            </div>
                          </div>

                          <div className="preferences-section-admin" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                            <h5 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Suscripción a Avisos</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={cliMaintSub} onChange={(e) => setCliMaintSub(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                                Mantenimiento (6m)
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={cliOffersSub} onChange={(e) => setCliOffersSub(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                                Promociones
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={cliNewsSub} onChange={(e) => setCliNewsSub(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                                Newsletter
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <input type="checkbox" checked={cliCanjeSub} onChange={(e) => setCliCanjeSub(e.target.checked)} style={{ accentColor: 'var(--color-primary)' }} />
                                Plan Canje
                              </label>
                            </div>
                          </div>

                          <div className="form-actions-admin">
                            <button type="button" className="btn btn-outline" onClick={() => setIsClientFormOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn btn-primary"><Save size={16} /> Guardar Cliente</button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Filters / Search Bar */}
                  <div className="search-filter-row-admin" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, correo o whatsapp..." 
                        value={clientSearchTerm} 
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
                      />
                    </div>
                    <div>
                      <select 
                        value={clientSubFilter} 
                        onChange={(e) => setClientSubFilter(e.target.value)}
                        style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', cursor: 'pointer' }}
                      >
                        <option value="all">Suscripciones: Todas</option>
                        <option value="maint">Suscrito: Mantenimiento</option>
                        <option value="offers">Suscrito: Promociones</option>
                        <option value="news">Suscrito: Newsletter</option>
                        <option value="canje">Suscrito: Plan Canje</option>
                        <option value="overdue">Mantenimiento: Vencidos</option>
                      </select>
                    </div>
                  </div>

                  {/* Clients Table */}
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Contacto</th>
                          <th>Dispositivo</th>
                          <th>Mantenimiento (Cada 6m)</th>
                          <th>Suscripciones</th>
                          <th>Acciones de Envío / Registro</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients
                          .filter(cli => {
                            const term = clientSearchTerm.toLowerCase();
                            const matchTerm = cli.name.toLowerCase().includes(term) || 
                                              cli.email.toLowerCase().includes(term) || 
                                              cli.phone.toLowerCase().includes(term);
                            
                            if (!matchTerm) return false;
                            
                            const lastMaint = cli.lastMaintenance;
                            let isOverdue = false;
                            if (lastMaint) {
                              const nextDate = new Date(lastMaint);
                              nextDate.setMonth(nextDate.getMonth() + 6);
                              isOverdue = nextDate.getTime() < new Date().getTime();
                            }

                            if (clientSubFilter === 'maint') return cli.preferences?.maintenanceSub !== false;
                            if (clientSubFilter === 'offers') return cli.preferences?.offersSub !== false;
                            if (clientSubFilter === 'news') return cli.preferences?.newsSub !== false;
                            if (clientSubFilter === 'canje') return cli.preferences?.canjeSub !== false;
                            if (clientSubFilter === 'overdue') return isOverdue;
                            return true;
                          })
                          .map(cli => {
                            // Calculate maintenance status
                            let statusText = 'No registrado';
                            let statusColor = 'var(--color-text-muted)';
                            let isOverdue = false;
                            
                            if (cli.lastMaintenance) {
                              const lastDate = new Date(cli.lastMaintenance);
                              const nextDate = new Date(lastDate);
                              nextDate.setMonth(nextDate.getMonth() + 6);
                              const today = new Date();
                              const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                              
                              if (diffDays < 0) {
                                statusText = `Vencido (${nextDate.toLocaleDateString('es-AR')})`;
                                statusColor = 'var(--color-danger)';
                                isOverdue = true;
                              } else if (diffDays <= 15) {
                                statusText = `Vence pronto (${nextDate.toLocaleDateString('es-AR')})`;
                                statusColor = 'var(--color-warning)';
                              } else {
                                statusText = `Al día (${nextDate.toLocaleDateString('es-AR')})`;
                                statusColor = 'var(--color-success)';
                              }
                            }

                            return (
                              <tr key={cli.id}>
                                <td className="col-title">
                                  <strong>{cli.name}</strong>
                                  <span className="table-subtext">Registrado: {cli.registeredAt || 'S/D'}</span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{cli.email}</span>
                                    <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{cli.phone}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge-cond cond-new" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{cli.device || 'Sin equipo'}</span>
                                </td>
                                <td>
                                  <span style={{ color: statusColor, fontWeight: '700', fontSize: '0.85rem' }}>{statusText}</span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                    {cli.preferences?.maintenanceSub !== false && <span className="badge-step step-1" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Mant.</span>}
                                    {cli.preferences?.offersSub !== false && <span className="badge-step step-2" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Promo</span>}
                                    {cli.preferences?.newsSub !== false && <span className="badge-step step-3" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>News</span>}
                                    {cli.preferences?.canjeSub !== false && <span className="badge-step step-4" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Canje</span>}
                                  </div>
                                </td>
                                <td>
                                  {/* Marketing Triggers */}
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {/* WhatsApp Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>WhatsApp:</span>
                                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {cli.preferences?.maintenanceSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'whatsapp', 'maintenance')} className="table-btn edit-btn" title="Enviar recordatorio de mantenimiento" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}>M</button>
                                        )}
                                        {cli.preferences?.offersSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'whatsapp', 'promotion')} className="table-btn edit-btn" title="Enviar oferta/promo" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}>P</button>
                                        )}
                                        {cli.preferences?.newsSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'whatsapp', 'news')} className="table-btn edit-btn" title="Enviar novedades" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}>N</button>
                                        )}
                                        {cli.preferences?.canjeSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'whatsapp', 'canje')} className="table-btn edit-btn" title="Enviar Plan Canje" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}>C</button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Email Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>Mail:</span>
                                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {cli.preferences?.maintenanceSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'email', 'maintenance')} className="table-btn edit-btn" title="Enviar recordatorio mail" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}><Mail size={12} /></button>
                                        )}
                                        {cli.preferences?.offersSub !== false && (
                                          <button onClick={() => sendMarketingTemplate(cli, 'email', 'promotion')} className="table-btn edit-btn" title="Enviar promo mail" style={{ width: '28px', height: '28px', fontSize: '0.8rem', padding: 0 }}><Gift size={12} /></button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Registrar mantenimiento hecho */}
                                    {isOverdue && (
                                      <button 
                                        onClick={() => handleRecordMaintenance(cli)}
                                        className="btn btn-outline" 
                                        style={{ height: '30px', padding: '0 0.5rem', fontSize: '0.75rem', marginTop: '1.2rem', borderColor: 'var(--color-success)', color: 'var(--color-success)', background: 'none' }}
                                      >
                                        Limpieza Lista
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="col-actions">
                                  <button onClick={() => openEditClient(cli)} className="table-btn edit-btn" title="Editar"><Edit size={16}/></button>
                                  <button onClick={() => handleDeleteClient(cli.id)} className="table-btn delete-btn" title="Eliminar"><Trash2 size={16}/></button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* CUSTOM DIALOG / CONFIRM MODAL */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="custom-modal-overlay">
            <motion.div 
              className="custom-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className={`custom-modal-icon ${modalConfig.variant}`}>
                {modalConfig.variant === 'success' && <CheckCircle2 size={32} />}
                {modalConfig.variant === 'danger' && <AlertCircle size={32} />}
                {modalConfig.variant === 'warning' && <AlertTriangle size={32} />}
                {modalConfig.variant === 'info' && <HelpCircle size={32} />}
              </div>
              
              <h3 className="custom-modal-title">{modalConfig.title}</h3>
              <p className="custom-modal-message">{modalConfig.message}</p>
              
              <div className="custom-modal-actions">
                {modalConfig.type === 'confirm' ? (
                  <>
                    <button 
                      onClick={modalConfig.onCancel} 
                      className="btn btn-outline custom-modal-btn cancel-btn"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={modalConfig.onConfirm} 
                      className={`btn custom-modal-btn confirm-btn ${modalConfig.variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                    >
                      Confirmar
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={modalConfig.onConfirm} 
                    className="btn btn-primary custom-modal-btn"
                  >
                    Aceptar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Admin;
