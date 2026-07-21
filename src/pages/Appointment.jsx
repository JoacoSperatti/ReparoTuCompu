import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Wrench,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Laptop,
  AlertTriangle,
} from 'lucide-react';
import { saveDbAppointment, getDbAppointments } from '../firebase';
import { CONFIG } from '../config';
import './Appointment.css';

// --- Config ---
const BUSINESS_HOURS = { start: 9, end: 18 };
const SLOT_INTERVAL = 60; // minutes
const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const SERVICE_TYPES = [
  'Reparación de notebook / PC',
  'Mantenimiento preventivo (limpieza + pasta)',
  'Formateo e instalación de Windows',
  'Armado de PC',
  'Diagnóstico',
  'Soporte remoto (en el local)',
  'Otro',
];

// Generate time slots for a business day
const generateSlots = () => {
  const slots = [];
  for (let h = BUSINESS_HOURS.start; h < BUSINESS_HOURS.end; h++) {
    const label = `${String(h).padStart(2, '0')}:00`;
    slots.push(label);
    if (SLOT_INTERVAL === 30) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};
const ALL_SLOTS = generateSlots();

// Format date to YYYY-MM-DD
const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─────────────────────────────────────────────────────────────
const Appointment = () => {
  const [step, setStep] = useState(1); // 1=calendar, 2=time, 3=form, 4=confirm

  // Calendar state
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);

  // Slot state
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({}); // { "2025-08-10": ["09:00","10:00"] }
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [device, setDevice] = useState('');
  const [service, setService] = useState(SERVICE_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmed appointment
  const [confirmed, setConfirmed] = useState(null);

  // Load all booked slots once
  const loadBookedSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const appointments = await getDbAppointments();
      const map = {};
      appointments.forEach(a => {
        if (!map[a.date]) map[a.date] = [];
        map[a.date].push(a.time);
      });
      setBookedSlots(map);
    } catch {
      // silent fail — slots all show as available
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => { loadBookedSlots(); }, [loadBookedSlots]);

  // ── Calendar helpers ──────────────────────────────────────
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();

  const isWeekend = (day) => {
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    return d.getDay() === 0 || d.getDay() === 6;
  };
  const isPast = (day) => {
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    return d < today;
  };
  const isFullyBooked = (day) => {
    const dateStr = toDateStr(new Date(calMonth.getFullYear(), calMonth.getMonth(), day));
    return (bookedSlots[dateStr] || []).length >= ALL_SLOTS.length;
  };
  const isSelectedDay = (day) => {
    if (!selectedDate) return false;
    return toDateStr(selectedDate) === toDateStr(new Date(calMonth.getFullYear(), calMonth.getMonth(), day));
  };

  const canGoPrev = () => {
    const prev = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
    return prev >= new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const handleSelectDay = (day) => {
    if (isWeekend(day) || isPast(day) || isFullyBooked(day)) return;
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    setSelectedDate(d);
    setSelectedTime(null);
    setStep(2);
  };

  // ── Available slots for selected date ────────────────────
  const availableSlots = selectedDate
    ? ALL_SLOTS.filter(t => !(bookedSlots[toDateStr(selectedDate)] || []).includes(t))
    : [];

  // ── Submit appointment ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Nombre y teléfono son obligatorios.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const appointment = {
      id: Date.now(),
      date: toDateStr(selectedDate),
      time: selectedTime,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      device: device.trim(),
      service,
      notes: notes.trim(),
      bookedAt: new Date().toISOString(),
      status: 'pendiente',
    };

    try {
      await saveDbAppointment(appointment);
      setConfirmed(appointment);
      setStep(4);
      // Update local booked slots
      setBookedSlots(prev => ({
        ...prev,
        [appointment.date]: [...(prev[appointment.date] || []), appointment.time],
      }));
    } catch {
      setErrorMsg('Ocurrió un error al guardar el turno. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAnother = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setName(''); setPhone(''); setEmail(''); setDevice('');
    setService(SERVICE_TYPES[0]); setNotes('');
    setConfirmed(null);
  };

  const whatsappConfirmUrl = confirmed
    ? `https://wa.me/${CONFIG.whatsappNumber}?text=Hola! Reservé un turno para el ${confirmed.date.split('-').reverse().join('/')} a las ${confirmed.time} hs (ID: ${confirmed.id}). Mi nombre es ${confirmed.name}. Quería confirmarlo.`
    : '#';

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Reservar Turno | Reparo Tu Compu</title>
        <meta name="description" content="Reservá tu turno online para traer tu computadora al taller. Elegís el día y horario que más te convenga. Sin filas, sin esperas." />
        <link rel="canonical" href="https://reparotucompu.com.ar/turnos" />
        <meta property="og:title" content="Reservar Turno Online | Reparo Tu Compu" />
        <meta property="og:description" content="Elegí el día y horario que más te convenga para traer tu equipo al taller. Sin filas, sin esperas." />
        <meta property="og:url" content="https://reparotucompu.com.ar/turnos" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Hero */}
      <section className="appt-hero">
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            Reservá tu Turno Online
          </motion.h1>
          <motion.p className="appt-hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            Elegís el día y horario que más te convenga. Sin filas ni esperas.
            <br />
            <strong>Atención de lunes a viernes de 9:00 a 18:00 hs.</strong>
          </motion.p>
        </div>
      </section>

      {/* Progress bar */}
      {step < 4 && (
        <div className="appt-progress-bar-wrap">
          <div className="container">
            <div className="appt-steps-indicator">
              {['Elegí el día', 'Elegí el horario', 'Tus datos'].map((label, i) => (
                <div key={i} className={`appt-step-indicator ${step >= i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
                  <div className="appt-step-dot">{step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="appt-content-section container">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Calendar ─────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" className="appt-card" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
              <div className="appt-card-header">
                <Calendar size={20} />
                <h2>Seleccioná un día</h2>
              </div>

              <div className="appt-calendar">
                <div className="appt-cal-nav">
                  <button
                    className="appt-cal-nav-btn"
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                    disabled={!canGoPrev()}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="appt-cal-title">
                    {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                  </span>
                  <button
                    className="appt-cal-nav-btn"
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="appt-cal-grid">
                  {DAYS_OF_WEEK.map(d => (
                    <div key={d} className="appt-cal-weekday">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="appt-cal-empty" />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const disabled = isWeekend(day) || isPast(day) || isFullyBooked(day);
                    const selected = isSelectedDay(day);
                    return (
                      <button
                        key={day}
                        className={`appt-cal-day ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''} ${isFullyBooked(day) ? 'full' : ''}`}
                        onClick={() => handleSelectDay(day)}
                        disabled={disabled}
                      >
                        {day}
                        {isFullyBooked(day) && !isWeekend(day) && !isPast(day) && (
                          <span className="appt-cal-full-dot" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="appt-cal-legend">
                  <span><span className="legend-dot available" />Disponible</span>
                  <span><span className="legend-dot full" />Sin turnos</span>
                  <span><span className="legend-dot disabled" />No laborable</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Time slots ───────────────────────────── */}
          {step === 2 && selectedDate && (
            <motion.div key="step2" className="appt-card" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
              <div className="appt-card-header">
                <Clock size={20} />
                <h2>Seleccioná el horario</h2>
                <button className="appt-back-btn" onClick={() => setStep(1)}>
                  <ChevronLeft size={16} /> Cambiar día
                </button>
              </div>

              <p className="appt-selected-date-label">
                <Calendar size={15} />
                {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>

              {loadingSlots ? (
                <div className="appt-loading">Cargando horarios disponibles...</div>
              ) : (
                <div className="appt-slots-grid">
                  {ALL_SLOTS.map(slot => {
                    const taken = (bookedSlots[toDateStr(selectedDate)] || []).includes(slot);
                    return (
                      <button
                        key={slot}
                        className={`appt-slot-btn ${taken ? 'taken' : ''} ${selectedTime === slot ? 'selected' : ''}`}
                        disabled={taken}
                        onClick={() => { setSelectedTime(slot); setStep(3); }}
                      >
                        {slot} hs
                        {taken && <span className="appt-slot-taken-label">Ocupado</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {!loadingSlots && availableSlots.length === 0 && (
                <div className="appt-no-slots">
                  <AlertTriangle size={20} />
                  No quedan turnos disponibles para este día. Por favor elegí otra fecha.
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Contact form ─────────────────────────── */}
          {step === 3 && selectedDate && selectedTime && (
            <motion.div key="step3" className="appt-card" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
              <div className="appt-card-header">
                <User size={20} />
                <h2>Tus datos</h2>
                <button className="appt-back-btn" onClick={() => setStep(2)}>
                  <ChevronLeft size={16} /> Cambiar horario
                </button>
              </div>

              <div className="appt-summary-badge">
                <Calendar size={15} />
                {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                <span className="appt-summary-sep">·</span>
                <Clock size={15} />
                {selectedTime} hs
              </div>

              {errorMsg && <div className="appt-error">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="appt-form">
                <div className="appt-form-grid">
                  <div className="appt-form-group">
                    <label><User size={15} /> Nombre y Apellido *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Juan Pérez" required />
                  </div>
                  <div className="appt-form-group">
                    <label><Phone size={15} /> WhatsApp / Celular *</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+54 9 11 1234 5678" required />
                  </div>
                  <div className="appt-form-group">
                    <label><Mail size={15} /> Correo Electrónico</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="juan@correo.com" />
                  </div>
                  <div className="appt-form-group">
                    <label><Laptop size={15} /> Equipo (Modelo / Marca)</label>
                    <input type="text" value={device} onChange={e => setDevice(e.target.value)} placeholder="Ej. Lenovo IdeaPad 3, Notebook HP" />
                  </div>
                </div>

                <div className="appt-form-group full-width">
                  <label><Wrench size={15} /> Tipo de Servicio *</label>
                  <select value={service} onChange={e => setService(e.target.value)} required>
                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="appt-form-group full-width">
                  <label>Descripción del problema (opcional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Contanos brevemente qué le pasa al equipo..."
                    rows={3}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? 'Reservando...' : 'Confirmar Turno'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── STEP 4: Confirmation ─────────────────────────── */}
          {step === 4 && confirmed && (
            <motion.div key="step4" className="appt-card appt-confirmed" variants={fadeInUp} initial="hidden" animate="visible">
              <div className="appt-confirmed-icon">
                <CheckCircle2 size={52} />
              </div>
              <h2>¡Turno Reservado!</h2>
              <p className="appt-confirmed-sub">Tu turno quedó agendado. Te esperamos en el taller.</p>

              <div className="appt-confirmed-details">
                <div className="appt-confirmed-row">
                  <Calendar size={16} />
                  <span>{new Date(confirmed.date + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="appt-confirmed-row">
                  <Clock size={16} />
                  <span>{confirmed.time} hs</span>
                </div>
                <div className="appt-confirmed-row">
                  <User size={16} />
                  <span>{confirmed.name}</span>
                </div>
                <div className="appt-confirmed-row">
                  <Wrench size={16} />
                  <span>{confirmed.service}</span>
                </div>
                <div className="appt-confirmed-row">
                  <span className="appt-confirmed-id">ID de turno: #{confirmed.id}</span>
                </div>
              </div>

              <div className="appt-confirmed-actions">
                <a href={whatsappConfirmUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <MessageCircle size={18} />
                  Confirmar por WhatsApp
                </a>
                <button onClick={handleBookAnother} className="btn btn-outline">
                  Reservar otro turno
                </button>
              </div>

              <p className="appt-confirmed-note">
                💡 Te recomendamos confirmar el turno por WhatsApp para que podamos tenerlo en cuenta. Llegá puntual o avisanos si no podés venir.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </section>
    </>
  );
};

export default Appointment;
