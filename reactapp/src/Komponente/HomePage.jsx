import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (validateForm()) {
      console.log('Podaci forme:', formData);
      alert('Vaša poruka je uspešno poslata!');
      setFormData({ name: '', email: '', message: '' });
      setCharCount(0);
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

          <button type="submit" className="send-button">
            Pošalji
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
