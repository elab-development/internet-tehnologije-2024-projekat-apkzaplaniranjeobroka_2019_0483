import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStatus from './useAuthStatus';

const Navbar = () => {
  const { isLoggedIn, user, logout, token } = useAuthStatus();
  const navigate = useNavigate();

  // Fallback na localStorage posle refresh-a
  let userFromStorage = null;
  try { userFromStorage = JSON.parse(localStorage.getItem('user')); } catch {}
  const effectiveUser = user || userFromStorage;

  // rola može biti string ("admin") ili objekat ({ name: "admin" }) ili npr. roles[0].name
  const role =
    effectiveUser?.role?.name ??
    effectiveUser?.role ??
    effectiveUser?.roles?.[0]?.name ??
    null;

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Greška pri odjavi:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Planiranje obroka app</h1>
      </div>

      <ul className="navbar-links">
        {/* Početna uvek vidljiva */}
        <li><Link to="/">Početna</Link></li>

        {!isLoggedIn ? (
          <>
            <li><Link to="/login">Prijavi se</Link></li>
            <li><Link to="/register">Registracija</Link></li>
            <li><Link to="/kontakt">Kontakt</Link></li>
          </>
        ) : (
          <>
            {/* za svakog ulogovanog */}
            <li><Link to="/planiraj">Planiraj</Link></li>
            <li><Link to="/kreirajPlan">KreirajPlan</Link></li>
            <li><Link to="/recepti/preporuke">Preporuke</Link></li>

            {/* samo admin */}
            {role === 'admin' && (
              <>
                <li><Link to="/recepti">Recepti</Link></li>
                <li><Link to="/users">Korisnici</Link></li>
              </>
            )}

            <li>
              <button className="logout-button" onClick={handleLogout}>
                Odjavi se ({effectiveUser?.name})
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
