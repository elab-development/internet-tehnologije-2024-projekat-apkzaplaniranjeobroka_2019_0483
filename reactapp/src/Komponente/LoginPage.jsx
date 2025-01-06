import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import useAuthStatus from './useAuthStatus';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const { isLoggedIn, user, login, logout } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [saveForQuickLogin, setSaveForQuickLogin] = useState(false); // Novi state za checkbox
  let navigate = useNavigate();

  // Učitavanje sačuvanih korisnika iz localStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('savedUsers')) || [];
    setSavedUsers(users);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Greška pri prijavljivanju');
      } else {
        alert(`Uspešno ste prijavljeni kao: ${data.user.name}`);

        // Čuvanje dijetetskih preferencija u localStorage
        if (data.user.dijetetske_preferencije) {
          localStorage.setItem(
            'dijetetske_preferencije',
            JSON.stringify(data.user.dijetetske_preferencije)
          );
        }

        // Pozivamo login funkciju sa tokenom i korisničkim podacima
        login(data.token, data.user);
        navigate('/planiraj');

        // Čuvanje tokena u localStorage
        localStorage.setItem('token', data.token);

        // Sačuvaj korisnika za brzi login ako je checkbox označen
        if (saveForQuickLogin) {
          const users = JSON.parse(localStorage.getItem('savedUsers')) || [];
          if (!users.some((user) => user.email === email)) {
            users.push({ name: data.user.name, email, password }); // Čuvamo i lozinku
            localStorage.setItem('savedUsers', JSON.stringify(users));
            setSavedUsers(users);
          }
        }
      }
    } catch (error) {
      setErrorMessage('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);

    // Automatski poziv za prijavu
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Greška pri brzom prijavljivanju');
      } else {
        alert(`Uspešno ste prijavljeni kao: ${data.user.name}`);

        // Čuvanje dijetetskih preferencija u localStorage
        if (data.user.dijetetske_preferencije) {
          localStorage.setItem(
            'dijetetske_preferencije',
            JSON.stringify(data.user.dijetetske_preferencije)
          );
        }

        login(data.token, data.user);
        navigate('/planiraj');
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      setErrorMessage('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = (userEmail) => {
    const updatedUsers = savedUsers.filter((user) => user.email !== userEmail);
    localStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
    setSavedUsers(updatedUsers);
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2 className="login-title">Prijavi se</h2>

        {/* Brzi login sekcija */}
        {savedUsers.length > 0 && (
          <div className="quick-login-section">
            <h3>Brzi login</h3>
            <div className="saved-users">
              {savedUsers.map((user, index) => (
                <div key={index} className="saved-user">
                  <div
                    className="saved-user-info"
                    onClick={() => handleQuickLogin(user.email, user.password)}
                  >
                    <span>{user.name}</span>
                    <p>{user.email}</p>
                  </div>
                  <button
                    className="remove-user-button"
                    onClick={() => handleRemoveUser(user.email)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email adresa:</label>
          <input
            type="email"
            name="email"
            placeholder="Vaša email adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Lozinka:</label>
          <input
            type="password"
            name="password"
            placeholder="Vaša lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="save-option">
            <input
              type="checkbox"
              id="saveForQuickLogin"
              checked={saveForQuickLogin}
              onChange={(e) => setSaveForQuickLogin(e.target.checked)}
            />
            <label htmlFor="saveForQuickLogin">Sačuvaj podatke za brzi login</label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
