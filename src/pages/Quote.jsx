import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  MonitorSmartphone, 
  RefreshCw, 
  CheckCircle2, 
  Laptop, 
  Monitor, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { CONFIG } from '../config';
import './Quote.css';

const defaultMessages = {
  reparacion: "Hola! Me gustaría consultar por la reparación de mi equipo.\nEl problema que presenta es: [Detallá el problema aquí]\nEl tipo de equipo es: [Notebook / PC de Escritorio / All in One / etc.]\nMarca y modelo (opcional): [Marca y modelo]",
  armado: "Hola! Me gustaría cotizar el armado de una PC.\nEl uso que le voy a dar es para: [Juegos / Oficina / Diseño]\nMi presupuesto aproximado es: [Monto]\nMe interesaría que incluya: [Componentes o requisitos específicos]",
  venta: "Hola! Estoy buscando comprar un equipo.\nMe interesa principalmente: [Notebook / PC de Escritorio / Monitor / etc.]\nMis requisitos de rendimiento son: [Básico / Medio / Alto]\nPara uso de: [Uso específico]",
  canje: "Hola! Quiero consultar por el Plan Canje.\nMi equipo actual es: [Procesador, RAM, Almacenamiento, Placa de video]\nEl equipo que me interesaría llevarme a cambio es: [PC Gamer / Notebook / etc.]",
  reparador: "Hola! Soy reparador/técnico y me gustaría consultar por la lista de precios mayorista y descuentos para el gremio.\nMi negocio/taller se llama: [Nombre]\nUbicación: [Localidad]",
  otro: "Hola! Tengo la siguiente consulta técnica o comercial: "
};

const DIAGNOSTIC_STEPS = {
  notebook: {
    label: "Notebook / Laptop",
    icon: Laptop,
    symptoms: [
      { id: "no_power", label: "No enciende absolutamente nada (muerta)", diagnostic: "Falla eléctrica. Podría deberse al cargador externo, pin de carga dañado, o un cortocircuito en los componentes reguladores de la placa madre.", recommendation: "Recomendamos no intentar encenderla repetidamente. Traerla para una medición eléctrica de placa en laboratorio.", estimatedPrice: "$25.000 - $65.000" },
      { id: "no_image", label: "Enciende pero la pantalla queda negra / sin imagen", diagnostic: "Problema de arranque de hardware. Típicamente causado por memorias RAM sulfatadas/dañadas, falla en la BIOS, o chip gráfico defectuoso.", recommendation: "Se requiere desarme técnico para limpieza de contactos, reprogramación de BIOS o reballing.", estimatedPrice: "$18.000 - $35.000" },
      { id: "slow", label: "Anda muy lenta / Tarda minutos en prender", diagnostic: "Lentitud por disco mecánico. Los discos rígidos tradicionales (HDD) sufren desgaste y ralentizan el sistema. También puede deberse a falta de memoria RAM.", recommendation: "Sustitución de disco HDD por un disco de estado sólido (SSD) e instalación limpia de sistema operativo. Esto acelera el equipo hasta 10 veces.", estimatedPrice: "$35.000 - $60.000 (Incluye repuesto SSD)" },
      { id: "hot", label: "Se calienta mucho, hace ruido y se apaga sola", diagnostic: "Estrangulamiento térmico (Thermal Throttling). La acumulación de tierra obstruye el cooler y la grasa térmica de fábrica se reseca, impidiendo disipar calor.", recommendation: "Mantenimiento preventivo urgente: limpieza física completa, lubricación del ventilador y cambio de pasta térmica por una de alta conductividad.", estimatedPrice: "$15.000 - $22.000" },
      { id: "screen", label: "Pantalla rota / Rayada / Hace parpadeos", diagnostic: "Daño físico en el panel LCD/IPS o flex de video dañado por la tensión de las bisagras.", recommendation: "Sustitución de pantalla por un módulo original nuevo calibrado. Revisión de bisagras.", estimatedPrice: "$80.000 - $160.000 (Sujeto al modelo de panel)" },
      { id: "liquid", label: "Se volcó líquido encima (agua, café, gaseosa)", diagnostic: "Cortocircuito y corrosión química activa por electrólisis (si el equipo tiene la batería conectada).", recommendation: "¡URGENTE! No la enciendas ni la pongas en arroz. Traela de inmediato para desconectar batería, realizar limpieza química por ultrasonido y secado profesional.", estimatedPrice: "$35.000 - $75.000" },
      { id: "software", label: "Tiene virus, publicidades o arroja errores de sistema", diagnostic: "Infección por malware, controladores corruptos o archivos del sistema dañados.", recommendation: "Eliminación de virus o reinstalación completa de sistema operativo Windows/macOS con software esencial.", estimatedPrice: "$16.000 - $22.000" }
    ]
  },
  desktop: {
    label: "PC de Escritorio / CPU",
    icon: Cpu,
    symptoms: [
      { id: "no_power", label: "No enciende nada (no giran ventiladores)", diagnostic: "Falla de energía. Principalmente causada por fuente de alimentación quemada tras un pico de tensión, cable defectuoso o botón de encendido roto.", recommendation: "Medición de voltajes de fuente y testeo puente. Si está dañada, se reemplaza por una nueva fuente homologada.", estimatedPrice: "$22.000 - $55.000 (Más costo de fuente si requiere cambio)" },
      { id: "no_image", label: "Giran los ventiladores pero no da imagen en monitor", diagnostic: "Falla de POST de placa madre. Suele ser causado por memorias RAM con polvo, placa de video mal asentada o pila CR2032 de la BIOS agotada.", recommendation: "Limpieza profunda de slots, reseteo físico de BIOS (Clear CMOS) y prueba de descarte de componentes.", estimatedPrice: "$12.000 - $25.000" },
      { id: "slow", label: "Muy lenta / Se congela jugando o trabajando", diagnostic: "Cuello de botella de almacenamiento o falta de memoria RAM. También puede ser causado por recalentamiento del procesador.", recommendation: "Instalación de unidad SSD para sistema operativo y optimización de archivos de paginación.", estimatedPrice: "$30.000 - $55.000 (SSD incluido)" },
      { id: "hot", label: "El cooler hace ruidos fuertes o procesador calienta", diagnostic: "Falla de rodamiento del cooler o grasa térmica reseca en el procesador.", recommendation: "Limpieza de gabinete, cambio de pasta térmica de CPU y sustitución de coolers gastados.", estimatedPrice: "$15.000 - $28.000" },
      { id: "software", label: "Pantallas azules de la muerte (BSOD) / Virus", diagnostic: "Controladores de video conflictivos, archivos de sistema dañados o sectores defectuosos en el disco rígido.", recommendation: "Diagnóstico de disco rígido y formateo / reinstalación de sistema operativo con backup previo.", estimatedPrice: "$16.000 - $22.000" }
    ]
  },
  aio: {
    label: "All In One (Todo en Uno)",
    icon: Monitor,
    symptoms: [
      { id: "no_power", label: "No enciende nada", diagnostic: "Falla en cargador tipo notebook o circuito interno de regulación de corriente.", recommendation: "Revisión de fuente de alimentación externa e interna.", estimatedPrice: "$20.000 - $50.000" },
      { id: "no_image", label: "Enciende la luz pero pantalla negra", diagnostic: "Falla en chip de video integrado, memorias RAM sucias, o retroiluminación (backlight) del panel rota.", recommendation: "Desarme técnico para revisión de flex e inverter.", estimatedPrice: "$18.000 - $35.000" },
      { id: "slow", label: "Muy lenta / Tarda en reaccionar", diagnostic: "Típicamente estos equipos vienen de fábrica con discos mecánicos muy lentos de 5400 RPM.", recommendation: "Cambio de disco por SSD y optimización del sistema operativo.", estimatedPrice: "$35.000 - $60.000 (SSD incluido)" },
      { id: "screen", label: "Pantalla astillada o rota físicamente", diagnostic: "Rotura del panel LCD/IPS integrado en el chasis del equipo.", recommendation: "Debido a que son repuestos específicos, es necesario cotizar según el código de parte de la pantalla original del fabricante.", estimatedPrice: "Sujeto a cotización de repuesto" }
    ]
  }
};

const Quote = () => {
  const [consultaType, setConsultaType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const formRef = useRef(null);
  const location = useLocation();

  // Tab State: 'form' (traditional quote) or 'wizard' (diagnostic helper)
  const [activeTab, setActiveTab] = useState('form');

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1); // 1: Equipment, 2: Symptom, 3: Result, 4: Contact
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [wizardName, setWizardName] = useState('');
  const [wizardPhone, setWizardPhone] = useState('');
  const [wizardEmail, setWizardEmail] = useState('');

  useEffect(() => {
    if (location.state && location.state.selectType) {
      const type = location.state.selectType;
      
      if (type === 'reparacion') {
        setActiveTab('wizard');
        setWizardStep(1);
      } else {
        setActiveTab('form');
        setConsultaType(type);
        setMessage(location.state.customMessage || defaultMessages[type] || '');
      }
      
      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleSelectQuoteType = (type) => {
    if (type === 'reparacion') {
      setActiveTab('wizard');
      setWizardStep(1);
      setSelectedEquipment('');
      setSelectedSymptom(null);
    } else {
      setActiveTab('form');
      setConsultaType(type);
      setMessage(defaultMessages[type] || '');
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    setConsultaType(selected);
    
    const isTextareaEmpty = !message.trim();
    const isCurrentMessageDefault = Object.values(defaultMessages).some(
      (val) => val.trim() === message.trim()
    );
    
    if (isTextareaEmpty || isCurrentMessageDefault) {
      setMessage(defaultMessages[selected] || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre') || '';
    const email = formData.get('email') || '';
    const telefono = formData.get('telefono') || '';
    const tipoVal = formData.get('tipo') || '';
    const mensajeVal = formData.get('mensaje') || '';

    setClientName(nombre);
    setIsSubmitted(true);

    const tipoLabel = {
      reparacion: 'Reparación de equipo',
      armado: 'Armado de PC a medida',
      venta: 'Venta de equipo',
      canje: 'Plan Canje',
      reparador: 'Soy reparador (Mayorista)',
      otro: 'Otro'
    }[tipoVal] || tipoVal;

    const whatsappText = `*Nueva Consulta - Reparo Tu Compu*\n\n` +
      `*Nombre:* ${nombre}\n` +
      `*Email:* ${email}\n` +
      `*Teléfono:* ${telefono}\n` +
      `*Tipo de consulta:* ${tipoLabel}\n\n` +
      `*Mensaje / Detalles:*\n${mensajeVal}`;

    const phoneNumber = CONFIG.whatsappNumber; 
    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Submit Handler for the Diagnostic Wizard
  const handleWizardSubmit = (e) => {
    e.preventDefault();
    setClientName(wizardName);
    setIsSubmitted(true);

    const eqLabel = DIAGNOSTIC_STEPS[selectedEquipment]?.label || selectedEquipment;
    const whatsappText = `*Nuevo Auto-Diagnóstico - Reparo Tu Compu*\n\n` +
      `*Cliente:* ${wizardName}\n` +
      `*Teléfono:* ${wizardPhone}\n` +
      `*Email:* ${wizardEmail}\n\n` +
      `*Detalles del Diagnóstico:*\n` +
      `- *Equipo:* ${eqLabel}\n` +
      `- *Problema:* ${selectedSymptom.label}\n\n` +
      `*Pre-Diagnóstico Técnico:* ${selectedSymptom.diagnostic}\n` +
      `*Solución Recomendada:* ${selectedSymptom.recommendation}\n` +
      `*Presupuesto:* Sujeto a diagnóstico final en laboratorio`;

    const phoneNumber = CONFIG.whatsappNumber; 
    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>Cotización | Reparo Tu Compu</title>
        <meta name="description" content="Solicitá presupuesto para armado de PC, reparación, venta o plan canje de forma fácil y rápida." />
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

      {/* Services Grid Selection */}
      <section className="quote-options-section container">
        <div className="grid grid-cols-4">
          <motion.div 
            className={`quote-card ${activeTab === 'wizard' ? 'active-card' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="quote-icon">
              <Wrench size={32} />
            </div>
            <h3>Reparación de PC</h3>
            <p>¿Tu equipo falla, no enciende o anda lento? Hacé un autodiagnóstico con nuestro asistente virtual y obtené una solución estimada.</p>
            <button 
              className="btn btn-primary w-100 mt-auto"
              onClick={() => handleSelectQuoteType('reparacion')}
            >
              Iniciar Asistente
            </button>
          </motion.div>

          <motion.div 
            className={`quote-card ${activeTab === 'form' && consultaType === 'armado' ? 'active-card' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <div className="quote-icon">
              <Cpu size={32} />
            </div>
            <h3>Armado de PC</h3>
            <p>Contanos qué uso le vas a dar (Gamer, Oficina, Diseño) y te armamos un presupuesto a medida con los mejores componentes.</p>
            <button 
              className="btn btn-primary w-100 mt-auto"
              onClick={() => handleSelectQuoteType('armado')}
            >
              Cotizar Armado
            </button>
          </motion.div>

          <motion.div 
            className={`quote-card ${activeTab === 'form' && consultaType === 'venta' ? 'active-card' : ''}`}
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
            <button 
              className="btn btn-primary w-100 mt-auto"
              onClick={() => handleSelectQuoteType('venta')}
            >
              Consultar Stock
            </button>
          </motion.div>

          <motion.div 
            className={`quote-card ${activeTab === 'form' && consultaType === 'canje' ? 'active-card' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="quote-icon">
              <RefreshCw size={32} />
            </div>
            <h3>Plan Canje</h3>
            <p>Tomamos tu PC usada en parte de pago. Describinos tu equipo actual y el que te gustaría llevarte.</p>
            <button 
              className="btn btn-primary w-100 mt-auto"
              onClick={() => handleSelectQuoteType('canje')}
            >
              Cotizar Canje
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Forms Section with Tab Layout */}
      <section className="quote-form-section container" ref={formRef}>
        <div className="quote-form-container">
          
          {/* Tab buttons */}
          <div className="quote-tabs-navigation">
            <button 
              className={`quote-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('form');
                if (!consultaType) setConsultaType('otro');
              }}
            >
              <MessageSquare size={18} /> Contacto General
            </button>
            <button 
              className={`quote-tab-btn ${activeTab === 'wizard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('wizard');
                setWizardStep(1);
              }}
            >
              <HelpCircle size={18} /> Asistente de Diagnóstico
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="quote-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-5"
                style={{ padding: '2rem 0' }}
              >
                <div className="mb-4" style={{ color: 'var(--color-success)', display: 'flex', justifyContent: 'center' }}>
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="mb-3">¡Consulta Enviada con Éxito!</h2>
                <p className="mb-4 text-large" style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                  Gracias <strong>{clientName}</strong> por contactarte. Te hemos redirigido a WhatsApp para completar el envío de tu mensaje. Nos pondremos en contacto con vos a la brevedad.
                </p>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setIsSubmitted(false);
                    setConsultaType('');
                    setMessage('');
                    setWizardStep(1);
                    setSelectedEquipment('');
                    setSelectedSymptom(null);
                  }}
                >
                  Realizar otra consulta
                </button>
              </motion.div>
            ) : activeTab === 'form' ? (
              // Traditional Form
              <motion.div
                key="traditional-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-center mb-4">Envíanos tu consulta</h2>
                <form className="quote-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre y Apellido</label>
                    <input name="nombre" type="text" placeholder="Ej. Juan Pérez" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="email" placeholder="tu@email.com" required />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input name="telefono" type="tel" placeholder="Código de área + Número" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tipo de consulta</label>
                    <select 
                      name="tipo" 
                      value={consultaType} 
                      onChange={handleSelectChange} 
                      required
                    >
                      <option value="">Seleccioná una opción...</option>
                      <option value="reparacion">Reparación de equipo</option>
                      <option value="armado">Armado de PC a medida</option>
                      <option value="venta">Venta de equipo</option>
                      <option value="canje">Plan Canje</option>
                      <option value="reparador">Soy reparador (Mayorista)</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mensaje / Detalles del equipo</label>
                    <textarea 
                      name="mensaje" 
                      rows="5" 
                      placeholder="Detallá acá todo lo necesario..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-large">Enviar Consulta</button>
                </form>
              </motion.div>
            ) : (
              // Diagnostic Wizard Form
              <motion.div
                key="wizard-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="wizard-container"
              >
                {/* Step indicator */}
                <div className="wizard-progress-bar">
                  <div className="wizard-progress-line">
                    <div className="wizard-progress-fill" style={{ width: `${(wizardStep - 1) / 3 * 100}%` }}></div>
                  </div>
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className={`wizard-progress-dot ${step < wizardStep ? 'completed' : ''} ${step === wizardStep ? 'active' : ''}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>

                <div className="wizard-step-content">
                  {/* Step 1: Equipment Selection */}
                  {wizardStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="wizard-step-box"
                    >
                      <h3 className="wizard-step-title">Paso 1: ¿Qué tipo de equipo necesita reparación?</h3>
                      <div className="wizard-options-grid">
                        {Object.entries(DIAGNOSTIC_STEPS).map(([key, value]) => {
                          const EqIcon = value.icon;
                          const isSelected = selectedEquipment === key;
                          return (
                            <div 
                              key={key} 
                              className={`wizard-option-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedEquipment(key);
                                setSelectedSymptom(null);
                                setWizardStep(2);
                              }}
                            >
                              <div className="wizard-option-icon">
                                <EqIcon size={36} />
                              </div>
                              <h4>{value.label}</h4>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Symptom Selection */}
                  {wizardStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="wizard-step-box"
                    >
                      <h3 className="wizard-step-title">Paso 2: ¿Cuál es el síntoma principal?</h3>
                      <p className="wizard-step-desc">
                        Seleccioná la opción que mejor describa el problema de tu {DIAGNOSTIC_STEPS[selectedEquipment]?.label}:
                      </p>
                      <div className="wizard-list-options">
                        {DIAGNOSTIC_STEPS[selectedEquipment]?.symptoms.map((symptom) => {
                          const isSelected = selectedSymptom?.id === symptom.id;
                          return (
                            <div 
                              key={symptom.id}
                              className={`wizard-list-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedSymptom(symptom);
                                setWizardStep(3);
                              }}
                            >
                              <div className="wizard-radio-circle">
                                {isSelected && <div className="radio-inner"></div>}
                              </div>
                              <span className="symptom-label-text">{symptom.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="wizard-navigation-buttons">
                        <button className="btn btn-outline" onClick={() => setWizardStep(1)}>
                          <ArrowLeft size={16} /> Volver
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Diagnostic Result */}
                  {wizardStep === 3 && selectedSymptom && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="wizard-step-box"
                    >
                      <h3 className="wizard-step-title">Paso 3: Pre-Diagnóstico Estimado</h3>
                      <div className="diagnostic-report-card">
                        <div className="report-header">
                          <AlertCircle size={24} className="text-primary" />
                          <h4>Diagnóstico preliminar para tu {DIAGNOSTIC_STEPS[selectedEquipment]?.label}</h4>
                        </div>
                        <div className="report-section">
                          <h5>Falla detectada:</h5>
                          <p>{selectedSymptom.label}</p>
                        </div>
                        <div className="report-section">
                          <h5>Causa técnica probable:</h5>
                          <p>{selectedSymptom.diagnostic}</p>
                        </div>
                        <div className="report-section">
                          <h5>Acción recomendada:</h5>
                          <p className="recommendation-text">{selectedSymptom.recommendation}</p>
                        </div>
                        <div className="report-section price-section">
                          <h5>Presupuesto:</h5>
                          <p className="price-estimation">Sujeto a diagnóstico final</p>
                          <span className="price-disclaimer">* El diagnóstico en laboratorio es 100% gratuito y sin compromiso. Te enviaremos el presupuesto exacto por WhatsApp.</span>
                        </div>
                      </div>

                      <div className="wizard-navigation-buttons">
                        <button className="btn btn-outline" onClick={() => setWizardStep(2)}>
                          <ArrowLeft size={16} /> Volver
                        </button>
                        <button className="btn btn-primary" onClick={() => setWizardStep(4)}>
                          Continuar al contacto <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Contact Form */}
                  {wizardStep === 4 && selectedSymptom && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="wizard-step-box"
                    >
                      <h3 className="wizard-step-title">Paso 4: Datos de Contacto</h3>
                      <p className="wizard-step-desc">
                        Ingresá tus datos para que podamos agendar la orden técnica de tu equipo y enviarte la solicitud vía WhatsApp.
                      </p>
                      
                      <form onSubmit={handleWizardSubmit} className="quote-form">
                        <div className="form-group">
                          <label>Nombre y Apellido</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Juan Pérez" 
                            value={wizardName}
                            onChange={(e) => setWizardName(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Email</label>
                            <input 
                              type="email" 
                              placeholder="tu@email.com" 
                              value={wizardEmail}
                              onChange={(e) => setWizardEmail(e.target.value)}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>Teléfono</label>
                            <input 
                              type="tel" 
                              placeholder="Código de área + Número" 
                              value={wizardPhone}
                              onChange={(e) => setWizardPhone(e.target.value)}
                              required 
                            />
                          </div>
                        </div>

                        <div className="wizard-summary-review">
                          <h4>Resumen de consulta:</h4>
                          <p>
                            <strong>Equipo:</strong> {DIAGNOSTIC_STEPS[selectedEquipment]?.label}<br/>
                            <strong>Falla:</strong> {selectedSymptom.label}
                          </p>
                        </div>

                        <div className="wizard-navigation-buttons">
                          <button type="button" className="btn btn-outline" onClick={() => setWizardStep(3)}>
                            <ArrowLeft size={16} /> Volver
                          </button>
                          <button type="submit" className="btn btn-primary btn-large">
                            Enviar y abrir WhatsApp <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </>
  );
};

export default Quote;
