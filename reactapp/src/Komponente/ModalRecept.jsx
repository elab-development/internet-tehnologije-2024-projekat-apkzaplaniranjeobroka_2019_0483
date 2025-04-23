import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalRecept = ({ isOpen, onClose, onReceptKreiran, onReceptIzmenjen, initialData }) => {
  const [formData, setFormData] = useState({
    naziv: '',
    opis: '',
    sastojci: '',
    nutritivne_vrednosti: {
      kalorije: '',
      proteini: '',
      masti: '',
      ugljeni_hidrati: '',
    },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        naziv: initialData.naziv,
        opis: initialData.opis || '',
        sastojci: initialData.sastojci.join(', '),
        nutritivne_vrednosti: {
          kalorije: initialData.nutritivne_vrednosti?.kalorije || '',
          proteini: initialData.nutritivne_vrednosti?.proteini || '',
          masti: initialData.nutritivne_vrednosti?.masti || '',
          ugljeni_hidrati: initialData.nutritivne_vrednosti?.ugljeni_hidrati || '',
        },
      });
    } else {
      setFormData({
        naziv: '',
        opis: '',
        sastojci: '',
        nutritivne_vrednosti: {
          kalorije: '',
          proteini: '',
          masti: '',
          ugljeni_hidrati: '',
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['kalorije', 'proteini', 'masti', 'ugljeni_hidrati'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        nutritivne_vrednosti: {
          ...prevData.nutritivne_vrednosti,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const isUpdating = !!initialData;

    try {
      const response = isUpdating
        ? await axios.put(
            `http://127.0.0.1:8000/api/recepti/${initialData.id}`,
            {
              naziv: formData.naziv,
              opis: formData.opis,
              sastojci: JSON.stringify(formData.sastojci.split(',')),
              nutritivne_vrednosti: JSON.stringify({
                kalorije: parseFloat(formData.nutritivne_vrednosti.kalorije) || 0,
                proteini: parseFloat(formData.nutritivne_vrednosti.proteini) || 0,
                masti: parseFloat(formData.nutritivne_vrednosti.masti) || 0,
                ugljeni_hidrati: parseFloat(formData.nutritivne_vrednosti.ugljeni_hidrati) || 0,
              }),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        : await axios.post(
            'http://127.0.0.1:8000/api/recepti',
            {
              naziv: formData.naziv,
              opis: formData.opis,
              sastojci: JSON.stringify(formData.sastojci.split(',')),
              nutritivne_vrednosti: JSON.stringify({
                kalorije: parseFloat(formData.nutritivne_vrednosti.kalorije) || 0,
                proteini: parseFloat(formData.nutritivne_vrednosti.proteini) || 0,
                masti: parseFloat(formData.nutritivne_vrednosti.masti) || 0,
                ugljeni_hidrati: parseFloat(formData.nutritivne_vrednosti.ugljeni_hidrati) || 0,
              }),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

      if (isUpdating) {
        onReceptIzmenjen(response.data);
      } else {
        onReceptKreiran(response.data);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Izmeni recept' : 'Kreiraj novi recept'}</h2>
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
          <fieldset>
            <legend>Nutritivne vrednosti:</legend>
            <label>
              Kalorije:
              <input
                type="number"
                name="kalorije"
                value={formData.nutritivne_vrednosti.kalorije}
                onChange={handleChange}
              />
            </label>
            <label>
              Proteini:
              <input
                type="number"
                name="proteini"
                value={formData.nutritivne_vrednosti.proteini}
                onChange={handleChange}
              />
            </label>
            <label>
              Masti:
              <input
                type="number"
                name="masti"
                value={formData.nutritivne_vrednosti.masti}
                onChange={handleChange}
              />
            </label>
            <label>
              Ugljeni hidrati:
              <input
                type="number"
                name="ugljeni_hidrati"
                value={formData.nutritivne_vrednosti.ugljeni_hidrati}
                onChange={handleChange}
              />
            </label>
          </fieldset>
          <div className="modal-actions">
            <button type="submit" className="submit-button">
              {initialData ? 'Izmeni' : 'Kreiraj'}
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
