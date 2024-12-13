import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [isSubmittingAllowed, setIsSubmittingAllowed] = useState(true);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsSubmittingAllowed(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'message') {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Sva polja moraju biti popunjena!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Unesite ispravnu email adresu!');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && isSubmittingAllowed) {
      alert(
        `Poruka uspešno poslata!\n\nIme i prezime: ${formData.name}\nEmail: ${formData.email}\nPoruka: ${formData.message}`
      );
      setFormData({ name: '', email: '', message: '' });
      setCharCount(0);
      setTimer(300); // 5 minuta = 300 sekundi
      setIsSubmittingAllowed(false);
    } else if (!isSubmittingAllowed) {
      alert(`Poruka može biti poslata tek za ${timer} sekundi.`);
    }
  };

  return (
    <div className="homepage-container">
      {/* Kontakt forma */}
      <section className="contact-section">
        <h2>Kontaktirajte nas</h2>
        <p>Imate pitanja, prijedloge ili trebate pomoć? Pošaljite nam poruku!</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Ime i prezime:</label>
          <input
            type="text"
            name="name"
            placeholder="Vaše ime i prezime"
            value={formData.name}
            onChange={handleInputChange}
          />

          <label>Email adresa:</label>
          <input
            type="email"
            name="email"
            placeholder="Vaš email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <label>Poruka:</label>
          <textarea
            name="message"
            rows="5"
            placeholder="Vaša poruka..."
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
          <p className="char-count">Karaktera preostalo: {500 - charCount}</p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            type="submit"
            className="send-button"
            disabled={!isSubmittingAllowed}
          >
            Pošalji
          </button>
          {!isSubmittingAllowed && (
            <p className="timer-message">
              Možete poslati novu poruku za {timer} sekundi.
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default HomePage;
