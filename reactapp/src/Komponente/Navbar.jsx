import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
import axios from 'axios';
import useAuthStatus from './useAuthStatus';

const Navbar = () => {
  const { isLoggedIn, user, logout, token } = useAuthStatus();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Poziv API-ja za odjavu (server-side logout)
      await axios.post(
        'http://127.0.0.1:8000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Greška pri odjavi:', error);
    } finally {
      // Lokalna odjava
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Planiranje Obroka</h1>
      </div>
      <ul className="navbar-links">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/">Početna</Link>
            </li>
            <li>
              <Link to="/login">Prijavi se</Link>
            </li>
            <li>
              <Link to="/register">Registracija</Link>
            </li>
            <li>
              <Link to="/kontakt">Kontakt</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/planiraj">Planiraj</Link>
            </li>
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Odjavi se ({user?.name})
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
