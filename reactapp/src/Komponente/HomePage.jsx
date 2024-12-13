import React, { useEffect, useState } from 'react';
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
      {/* Hero sekcija sa pozadinskim videom */}
      <section className="hero-section">
        <video className="background-video" autoPlay muted loop>
        <source src={require('./Videos/HeroVideo.mp4')} type="video/mp4" />
        </video>
        <div className="hero-overlay">
          <h1 className="hero-title">Planiraj svoje obroke uz lakoću</h1>
          <p className="hero-subtitle">Napravi nedeljni plan obroka, odaberi recepte i generiši listu za kupovinu automatski.</p>
          <button className="cta-button">Započni sada</button>
        </div>
      </section>

      {/* Sekcija sa informacijama o aplikaciji */}
      <section className="info-section">
        <div className="info-content">
          <h2>Zašto baš naša aplikacija?</h2>
          <p>
            Naša aplikacija vam pomaže da pametno planirate obroke za čitavu nedelju. Pretražite recepte, filtrirajte po sastojcima, isključite alergene i kreirajte personalizovane planove ishrane.  
            Automatski generišite listu za kupovinu i uštedite vreme i novac.
          </p>
        </div>
        <div className="info-images">
          <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Healthy meal" className="info-image"/>
          <img src="https://images.pexels.com/photos/7410953/pexels-photo-7410953.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Groceries list" className="info-image"/>
        </div>
      </section>

      {/* Sekcija sa prikazom funkcionalnosti */}
      <section className="features-section">
        <h2>Naše funkcionalnosti</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Recipe Search" />
            <h3>Pretraga recepata</h3>
            <p>Pretražuj recepte po sastojcima, kategorijama ili nutritivnim potrebama i pronađi savršeni obrok.</p>
          </div>
          <div className="feature-card">
            <img src="https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meal Planning" />
            <h3>Planiranje obroka</h3>
            <p>Organizuj sedmični jelovnik i budi siguran da je svaki obrok izbalansiran i ukusan.</p>
          </div>
          <div className="feature-card">
            <img src="https://images.pexels.com/photos/6287299/pexels-photo-6287299.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Shopping List" />
            <h3>Lista za kupovinu</h3>
            <p>Generiši listu za kupovinu na osnovu odabranih recepata i sastojaka, bez gnjavaže.</p>
          </div>
          <div className="feature-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5W8f5qCcvNWdlmiso3CQkx_1GdQSCS4WnGA&s" alt="Diet Preferences" />
            <h3>Personalizacija</h3>
            <p>Prilagodi ishranu prema alergijama, dijetetskim ograničenjima i nutritivnim potrebama.</p>
          </div>
        </div>
      </section>

      {/* Sekcija sa svedočanstvima */}
      <section className="testimonials-section">
        <h2>Šta kažu naši korisnici</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <img src="https://images.pexels.com/photos/3775537/pexels-photo-3775537.jpeg?auto=compress&cs=tinysrgb&w=200" alt="User 1" />
            <p>"Aplikacija mi je olakšala pripremu obroka za cijelu porodicu! Sada znam tačno šta kupiti i koliko."</p>
            <h4>- Ana</h4>
          </div>
          <div className="testimonial">
            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200" alt="User 2" />
            <p>"Kao vegan, konačno imam alat koji mi pomaže da pronađem odgovarajuće recepte i kreiram zdrave obroke."</p>
            <h4>- Marko</h4>
          </div>
          <div className="testimonial">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="User 3" />
            <p>"Sada štedim i vrijeme i novac, a nikad nisam bio kreativniji u kuhinji!"</p>
            <h4>- Ivana</h4>
          </div>
        </div>
      </section>

   
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
