import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Store from './pages/Store';
import Quote from './pages/Quote';
import Warranty from './pages/Warranty';
import Services from './pages/Services';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Store />} />
          <Route path="cotizacion" element={<Quote />} />
          <Route path="garantias" element={<Warranty />} />
          <Route path="servicios" element={<Services />} />
          <Route path="seguimiento" element={<Tracking />} />
          <Route path="gestion-interna" element={<Admin />} />
          <Route path="acceso-clientes" element={<Auth />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

