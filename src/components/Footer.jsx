import { Link } from 'react-router-dom';
import { Monitor, MessageCircle, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container grid grid-cols-4 footer-content">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="Reparo Tu Compu" className="footer-logo-img" />
            <span>Reparo Tu Compu</span>
          </Link>
          <p className="footer-desc">
            Soluciones informáticas profesionales. Reparación, venta y armado de equipos a medida.
          </p>
        </div>

        <div className="footer-col">
          <h3>Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
            <li><Link to="/trabajos">Trabajos Realizados</Link></li>
            <li><Link to="/cotizacion">Cotización</Link></li>
            <li><Link to="/garantias">Garantías</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Servicios</h3>
          <ul className="footer-links">
            <li><Link to="/cotizacion">Armado de PC</Link></li>
            <li><Link to="/cotizacion">Plan Canje</Link></li>
            <li><Link to="/tienda">Venta de Equipos</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contacto</h3>
          <p className="footer-desc mb-2">
            ¿Sos reparador? Consúltanos por mejores precios.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Mail"><Mail size={20} /></a>
            <a href="#" aria-label="WhatsApp"><MessageCircle size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Reparo Tu Compu. DESARROLLADO POR <a href="https://portafolio-joaquinsperatti.vercel.app/" target="_blank" rel="noopener noreferrer" className="dev-link">JOAQUÍN SPERATTI</a></p>
      </div>
    </footer>
  );
};

export default Footer;
