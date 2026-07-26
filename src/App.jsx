import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Store = lazy(() => import('./pages/Store'));
const Quote = lazy(() => import('./pages/Quote'));
const Warranty = lazy(() => import('./pages/Warranty'));
const Services = lazy(() => import('./pages/Services'));
const Tracking = lazy(() => import('./pages/Tracking'));
const Admin = lazy(() => import('./pages/Admin'));
const Auth = lazy(() => import('./pages/Auth'));
const RemoteSupport = lazy(() => import('./pages/RemoteSupport'));
const Appointment = lazy(() => import('./pages/Appointment'));
const Blog = lazy(() => import('./pages/Blog'));

const FallbackLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(5px)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(0, 255, 204, 0.2)', borderTopColor: '#00ffcc', animation: 'spin 1s linear infinite' }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem('visitedToday')) {
        const dateObj = new Date();
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const todayStr = days[dateObj.getDay()];
        const visits = JSON.parse(localStorage.getItem('siteVisits') || '{"Lun":0, "Mar":0, "Mié":0, "Jue":0, "Vie":0, "Sáb":0, "Dom":0}');
        
        if (visits[todayStr] !== undefined) {
          visits[todayStr] += 1;
        } else {
          visits[todayStr] = 1;
        }
        localStorage.setItem('siteVisits', JSON.stringify(visits));
        sessionStorage.setItem('visitedToday', 'true');
      }
    } catch (e) { console.error("Error tracking visit", e) }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tienda" element={<Store />} />
            <Route path="cotizacion" element={<Quote />} />
            <Route path="garantias" element={<Warranty />} />
            <Route path="servicios" element={<Services />} />
            <Route path="blog" element={<Blog />} />
            <Route path="soporte-remoto" element={<RemoteSupport />} />
            <Route path="turnos" element={<Appointment />} />
            <Route path="seguimiento" element={<Tracking />} />
            <Route path="gestion-interna" element={<Admin />} />
            <Route path="acceso-clientes" element={<Auth />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

