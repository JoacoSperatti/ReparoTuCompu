import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Store from './pages/Store';
import Quote from './pages/Quote';
import Warranty from './pages/Warranty';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Store />} />
          <Route path="cotizacion" element={<Quote />} />
          <Route path="garantias" element={<Warranty />} />
          <Route path="trabajos" element={<Portfolio />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
