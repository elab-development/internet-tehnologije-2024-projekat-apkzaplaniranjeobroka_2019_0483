import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [selectedAlergije, setSelectedAlergije] = useState([]);
  const [selectedDijetetskePreferencije, setSelectedDijetetskePreferencije] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Dodajemo useNavigate za preusmeravanje

  const alergijeOpcije = [
    'Gluten', 'Laktoza', 'Kikiriki', 'Orašasti plodovi', 'Jaja',
    'Riba', 'Školjke', 'Soja', 'Sezam', 'Med'
  ];

  const dijetetskeOpcije = [
    'Vegetarijanstvo', 'Vegan', 'Bez šećera', 'Bez soli', 'Keto',
    'Paleo', 'Bez glutena', 'Visokoproteinska'
  ];

  const toggleOption = (option, setOptions) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
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
        // Prikazujemo greške kroz alert
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          alert(`Greške:\n${errorMessages}`);
        } else {
          alert('Greška pri registraciji');
        }
      } else {
        alert(`Uspešno ste registrovani, dobrodošli ${data.user.name}`);
        navigate('/login'); // Preusmeravanje na login stranicu
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
        <form className="login-form" onSubmit={handleSubmit}>
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
          <input
            type="password"
            placeholder="Vaša lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Potvrdi lozinku:</label>
          <input
            type="password"
            placeholder="Potvrdi lozinku"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

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
