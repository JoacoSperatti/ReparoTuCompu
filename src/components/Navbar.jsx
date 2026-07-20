import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Reparo Tu Compu" className="navbar-logo-img" />
          <span>Reparo Tu Compu</span>
        </NavLink>

        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/tienda" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Tienda
          </NavLink>
          <NavLink to="/servicios" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Servicios
          </NavLink>
          <NavLink to="/cotizacion" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Cotización
          </NavLink>
          <NavLink to="/garantias" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Garantías
          </NavLink>
          <NavLink to="/seguimiento" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Seguimiento
          </NavLink>
          <button 
            className="theme-toggle" 
            onClick={() => {
              toggleTheme();
              closeMenu();
            }} 
            aria-label="Alternar modo claro y oscuro"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
