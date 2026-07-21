import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Monitor,
  ShieldCheck,
  Wifi,
  Mail,
  Printer,
  Zap,
  CheckCircle,
  ArrowRight,
  Download,
  Clock,
  Globe,
} from 'lucide-react';
import { CONFIG } from '../config';
import './RemoteSupport.css';

const RemoteSupport = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const PROBLEMS = [
    {
      icon: <Zap size={28} />,
      title: 'PC Lenta o que Tarda en Iniciar',
      desc: 'Optimizamos el arranque, limpiamos archivos basura, desactivamos programas innecesarios y liberamos recursos.',
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Virus y Malware',
      desc: 'Eliminación completa de virus, ransomware, adware y programas espía. Instalación y configuración de antivirus.',
    },
    {
      icon: <Monitor size={28} />,
      title: 'Errores de Windows / Pantalla Azul',
      desc: 'Diagnóstico y reparación de errores de sistema, actualizaciones fallidas, drivers corruptos y pantallas azules.',
    },
    {
      icon: <Wifi size={28} />,
      title: 'Problemas de Red e Internet',
      desc: 'Configuración de WiFi, VPN, redes domésticas y solución de problemas de conectividad.',
    },
    {
      icon: <Mail size={28} />,
      title: 'Configuración de Correo y Apps',
      desc: 'Configuración de Outlook, Gmail, cuentas de Office 365, Microsoft Teams, Zoom y otras aplicaciones.',
    },
    {
      icon: <Printer size={28} />,
      title: 'Impresoras y Periféricos',
      desc: 'Instalación de impresoras, escáneres, tablets y cualquier dispositivo que no sea reconocido por el sistema.',
    },
  ];

  const STEPS = [
    {
      num: '01',
      title: 'Contactanos por WhatsApp',
      desc: 'Describinos el problema de tu equipo. En minutos te confirmamos si se puede resolver de forma remota.',
    },
    {
      num: '02',
      title: 'Descargá AnyDesk',
      desc: 'Te enviamos el enlace de descarga del software de acceso remoto. Es liviano, seguro y no requiere instalación.',
    },
    {
      num: '03',
      title: 'Compartís el código',
      desc: 'AnyDesk te genera un código de 9 dígitos. Nos lo compartís por WhatsApp y aceptás la conexión cuando lo solicitemos.',
    },
    {
      num: '04',
      title: 'Problema resuelto',
      desc: 'Trabajamos en tu equipo en tiempo real mientras ves todo en pantalla. Vos tenés el control total en todo momento.',
    },
  ];

  const PRICING = [
    {
      service: 'Optimización y limpieza de sistema',
      time: '30–60 min',
      price: 'Consultar',
    },
    {
      service: 'Eliminación de virus y malware',
      time: '45–90 min',
      price: 'Consultar',
    },
    {
      service: 'Reparación de errores de Windows',
      time: '30–60 min',
      price: 'Consultar',
    },
    {
      service: 'Configuración de correo / Office',
      time: '20–40 min',
      price: 'Consultar',
    },
    {
      service: 'Instalación de programas y drivers',
      time: '20–45 min',
      price: 'Consultar',
    },
    {
      service: 'Configuración de red / WiFi',
      time: '20–40 min',
      price: 'Consultar',
    },
  ];

  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=Hola! Me gustaría coordinar una sesión de soporte remoto. Mi problema es: `;
  const anyDeskUrl = 'https://anydesk.com/es/downloads';

  return (
    <>
      <Helmet>
        <title>Soporte Remoto | Reparo Tu Compu</title>
        <meta
          name="description"
          content="Solucionamos tu PC sin que te muevas. Eliminamos virus, reparamos errores de Windows, optimizamos el sistema y configuramos tus programas de forma remota y segura."
        />
        <link rel="canonical" href="https://reparotucompu.com.ar/soporte-remoto" />
        <meta property="og:title" content="Soporte Técnico Remoto | Reparo Tu Compu" />
        <meta
          property="og:description"
          content="Solucionamos tu PC sin que te muevas. Virus, lentitud, errores de Windows y más, resueltos de forma remota y segura."
        />
        <meta property="og:url" content="https://reparotucompu.com.ar/soporte-remoto" />
      </Helmet>

      {/* Hero */}
      <section className="remote-hero">
        <div className="container text-center">
          <motion.div
            className="remote-hero-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Globe size={14} />
            Atendemos todo el país
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Soporte Técnico Remoto
          </motion.h1>
          <motion.p
            className="remote-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Solucionamos tu PC <strong>sin que te muevas de casa</strong>. Conectamos con tu
            equipo de forma segura y resolvemos el problema en tiempo real mientras vos ves
            todo en pantalla.
          </motion.p>
          <motion.div
            className="remote-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Iniciar Sesión Remota
            </a>
            <a
              href={anyDeskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <Download size={18} />
              Descargar AnyDesk
            </a>
          </motion.div>
        </div>
      </section>

      {/* What we solve */}
      <section className="remote-problems-section container">
        <motion.div
          className="remote-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>¿Qué problemas resolvemos de forma remota?</h2>
          <p>Si el problema es de software, en la gran mayoría de los casos lo resolvemos sin que tengas que mover el equipo.</p>
        </motion.div>

        <div className="remote-problems-grid">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={i}
              className="remote-problem-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: i * 0.08 }}
            >
              <div className="remote-problem-icon">{problem.icon}</div>
              <h3>{problem.title}</h3>
              <p>{problem.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="remote-not-covered"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <strong>¿Qué NO se puede resolver de forma remota?</strong> Problemas de hardware
          físico como pantallas rotas, plaquetas quemadas, problemas de encendido, cambio de
          pasta térmica o cualquier falla que requiera abrir el equipo. Para esos casos,{' '}
          <a href="/cotizacion">solicitá un presupuesto presencial</a>.
        </motion.div>
      </section>

      {/* How it works */}
      <section className="remote-steps-section">
        <div className="container">
          <motion.div
            className="remote-section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>¿Cómo funciona?</h2>
            <p>El proceso es simple, rápido y 100% seguro. Vos tenés el control en todo momento.</p>
          </motion.div>

          <div className="remote-steps-grid">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                className="remote-step-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <div className="remote-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="remote-step-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="remote-pricing-section container">
        <motion.div
          className="remote-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2>Servicios y Tiempos Estimados</h2>
          <p>Los precios se acuerdan previamente por WhatsApp según la complejidad del caso.</p>
        </motion.div>

        <motion.div
          className="remote-pricing-table"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="remote-pricing-header">
            <span>Servicio</span>
            <span>Tiempo estimado</span>
            <span>Precio</span>
          </div>
          {PRICING.map((row, i) => (
            <div key={i} className="remote-pricing-row">
              <span className="remote-pricing-service">
                <CheckCircle size={16} />
                {row.service}
              </span>
              <span className="remote-pricing-time">
                <Clock size={14} />
                {row.time}
              </span>
              <span className="remote-pricing-price">{row.price}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Security note + CTA */}
      <section className="remote-cta-section">
        <div className="container">
          <motion.div
            className="remote-cta-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="remote-cta-security">
              <ShieldCheck size={40} />
              <div>
                <h3>Tu seguridad es lo primero</h3>
                <p>
                  AnyDesk encripta toda la conexión. Vos ves en pantalla cada acción que realizamos
                  y podés interrumpir la sesión con un click en cualquier momento. Nunca pedimos
                  contraseñas ni datos bancarios.
                </p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Coordinar Soporte Remoto por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RemoteSupport;
