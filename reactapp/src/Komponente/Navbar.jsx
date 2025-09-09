import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStatus from './useAuthStatus';

const Navbar = () => {
  const { isLoggedIn, user, logout, token } = useAuthStatus();
  const navigate = useNavigate();

  // Fallback na localStorage da radi i odmah posle refresh-a
  let userFromStorage = null;
  try {
    userFromStorage = JSON.parse(localStorage.getItem('user'));
  } catch {}
  const effectiveUser = user || userFromStorage;
  const role = effectiveUser?.role;

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
        {!isLoggedIn ? (
          <>
            <li><Link to="/">Početna</Link></li>
            <li><Link to="/login">Prijavi se</Link></li>
            <li><Link to="/register">Registracija</Link></li>
            <li><Link to="/kontakt">Kontakt</Link></li>
          </>
        ) : (
          <>
            {/* za svakog ulogovanog */}
            <li><Link to="/planiraj">Planiraj</Link></li>
            <li><Link to="/kreirajPlan">KreirajPlan</Link></li>

            {/* SAMO admin vidi ove linkove */}
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
