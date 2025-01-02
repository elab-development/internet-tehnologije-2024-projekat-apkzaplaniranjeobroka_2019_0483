import React, { useState } from 'react';
import axios from 'axios';
 

const ModalRecept = ({ isOpen, onClose, onReceptKreiran }) => {
  const [formData, setFormData] = useState({
    naziv: '',
    opis: '',
    sastojci: '',
    nutritivne_vrednosti: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/recepti',
        {
          naziv: formData.naziv,
          opis: formData.opis,
          sastojci: JSON.stringify(formData.sastojci.split(',')),
          nutritivne_vrednosti: JSON.stringify({
            kalorije: formData.nutritivne_vrednosti.kalorije || 0,
            proteini: formData.nutritivne_vrednosti.proteini || 0,
            masti: formData.nutritivne_vrednosti.masti || 0,
            ugljeni_hidrati: formData.nutritivne_vrednosti.ugljeni_hidrati || 0,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onReceptKreiran(response.data); // Poziva funkciju za osvežavanje
      onClose(); // Zatvara modal
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Kreiraj novi recept</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Naziv:
            <input
              type="text"
              name="naziv"
              value={formData.naziv}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Opis:
            <textarea
              name="opis"
              value={formData.opis}
              onChange={handleChange}
            />
          </label>
          <label>
            Sastojci (odvojeni zarezom):
            <input
              type="text"
              name="sastojci"
              value={formData.sastojci}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nutritivne vrednosti:
            <input
              type="text"
              name="nutritivne_vrednosti"
              placeholder="Kalorije, Proteini, Masti, Ugljeni hidrati"
              value={formData.nutritivne_vrednosti}
              onChange={handleChange}
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              Kreiraj
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Zatvori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRecept;
