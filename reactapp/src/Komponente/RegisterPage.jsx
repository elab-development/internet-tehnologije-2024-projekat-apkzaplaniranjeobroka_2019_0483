import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [selectedAlergije, setSelectedAlergije] = useState([]);
  const [selectedDijetetskePreferencije, setSelectedDijetetskePreferencije] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = 'ag23EGdc6Mp8KAFR8e9b0a2l5XXP4KdS7zFrPTV5';

  const alergijeOpcije = ['Gluten', 'Laktoza', 'Kikiriki', 'Orašasti plodovi', 'Jaja', 'Riba', 'Školjke', 'Soja', 'Sezam', 'Med'];

  const dijetetskeOpcije = ['Vegetarijanstvo', 'Vegan', 'Bez šećera', 'Bez soli', 'Keto', 'Paleo', 'Bez glutena', 'Visokoproteinska'];

  const toggleOption = (option, setOptions) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const generatePassword = async () => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/passwordgenerator?length=12', {
        headers: { 'X-Api-Key': API_KEY },
      });
      const data = await response.json();
      if (data.random_password) {
        setPassword(data.random_password);
        setPasswordConfirmation(data.random_password);
      }
    } catch (error) {
      alert('Greška pri generisanju lozinke.');
    }
  };

  const generateUserData = async () => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/randomuser', {
        headers: { 'X-Api-Key': API_KEY },
      });
      const data = await response.json();
      if (data) {
        setName(`${data.name}`);
        setEmail(data.email);
      }
    } catch (error) {
      alert('Greška pri generisanju podataka korisnika.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          alergije: JSON.stringify(selectedAlergije),
          dijetetske_preferencije: JSON.stringify(selectedDijetetskePreferencije),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = Object.values(data.errors).flat().join('\n');
        alert(`Greške:\n${errorMessages}`);
      } else {
        alert(`Uspešno ste registrovani, dobrodošli ${data.user.name}`);
        navigate('/login');
      }
    } catch (error) {
      alert('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2 className="login-title">Registracija</h2>
        <form className="login-form"
          onSubmit={handleSubmit}>
          <label>Ime i prezime:</label>
          <input
            type="text"
            placeholder="Vaše ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email adresa:</label>
          <input
            type="email"
            placeholder="Vaša email adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Lozinka:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Vaša lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          <label>Potvrdi lozinku:</label>
          <div className="password-input-container">
            <input
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="Potvrdi lozinku"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPasswordConfirmation((prev) => !prev)}
            >
              {showPasswordConfirmation ? '👁️' : '🙈'}
            </span>
          </div>

          <div className="button-container">
            <button type="button" onClick={generatePassword} className="login-button">
              Generiši lozinku
            </button>
            <button type="button" onClick={generateUserData} className="login-button">
              Generiši podatke korisnika
            </button>
          </div>

          <label>Alergije (izaberi):</label>
          <div className="alergije-container">
            {alergijeOpcije.map((alergija) => (
              <button
                type="button"
                key={alergija}
                className={`alergija-button ${
                  selectedAlergije.includes(alergija) ? 'selected' : ''
                }`}
                onClick={() => toggleOption(alergija, setSelectedAlergije)}
              >
                {alergija}
              </button>
            ))}
          </div>

          <label>Dijetetske preferencije (izaberi):</label>
          <div className="alergije-container">
            {dijetetskeOpcije.map((preferencija) => (
              <button
                type="button"
                key={preferencija}
                className={`alergija-button ${
                  selectedDijetetskePreferencije.includes(preferencija) ? 'selected' : ''
                }`}
                onClick={() => toggleOption(preferencija, setSelectedDijetetskePreferencije)}
              >
                {preferencija}
              </button>
            ))}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Registracija...' : 'Registruj se'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
