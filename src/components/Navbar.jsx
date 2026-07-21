import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'servicios' | 'info' | null
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(null);
  };

  const toggleDropdown = (name) => {
    setDropdownOpen(prev => (prev === name ? null : name));
  };

  const navLinkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Reparo Tu Compu" className="navbar-logo-img" />
          <span>Reparo Tu Compu</span>
        </NavLink>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop + Mobile nav */}
        <nav className={`navbar-links ${isOpen ? 'active' : ''}`} ref={dropdownRef}>
          {/* Primary links */}
          <NavLink to="/" className={navLinkClass} onClick={closeMenu} end>
            Inicio
          </NavLink>
          <NavLink to="/tienda" className={navLinkClass} onClick={closeMenu}>
            Tienda
          </NavLink>
          <NavLink to="/servicios" className={navLinkClass} onClick={closeMenu}>
            Servicios
          </NavLink>

          {/* Dropdown: Gestiones */}
          <div className={`nav-dropdown-wrapper ${dropdownOpen === 'gestiones' ? 'open' : ''}`}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => toggleDropdown('gestiones')}
              aria-expanded={dropdownOpen === 'gestiones'}
            >
              Gestiones
              <ChevronDown size={15} className="dropdown-chevron" />
            </button>
            <div className="nav-dropdown-menu">
              <NavLink to="/cotizacion" className={navLinkClass} onClick={closeMenu}>
                Cotización
              </NavLink>
              <NavLink to="/turnos" className={navLinkClass} onClick={closeMenu}>
                Turnos
              </NavLink>
              <NavLink to="/soporte-remoto" className={navLinkClass} onClick={closeMenu}>
                Soporte Remoto
              </NavLink>
              <NavLink to="/seguimiento" className={navLinkClass} onClick={closeMenu}>
                Seguimiento
              </NavLink>
            </div>
          </div>

          {/* Dropdown: Info */}
          <div className={`nav-dropdown-wrapper ${dropdownOpen === 'info' ? 'open' : ''}`}>
            <button
              className="nav-dropdown-trigger"
              onClick={() => toggleDropdown('info')}
              aria-expanded={dropdownOpen === 'info'}
            >
              Info
              <ChevronDown size={15} className="dropdown-chevron" />
            </button>
            <div className="nav-dropdown-menu">
              <NavLink to="/garantias" className={navLinkClass} onClick={closeMenu}>
                Garantías
              </NavLink>
              <NavLink to="/acceso-clientes" className={navLinkClass} onClick={closeMenu}>
                Área Cliente
              </NavLink>
            </div>
          </div>

          {/* Right-side controls */}
          <div className="navbar-controls">
            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={() => { toggleTheme(); }}
              aria-label="Alternar modo claro y oscuro"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
