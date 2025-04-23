import React, { useState } from 'react';
import useRecepti from './useRecepti';
import { useNavigate } from 'react-router-dom';
import './Obroci.css';
import Stavka from './Stavka';

const KreirajPlanObroka = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const { recepti, isLoading: receptiLoading, error: receptiError } = useRecepti(token);

  const [plan, setPlan] = useState({ naziv: '', period_od: '', period_do: '' });
  const [stavke, setStavke] = useState([{ recept_id: '', datum: '', tip_obroka: '' }]);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddStavka = () => {
    setStavke([...stavke, { recept_id: '', datum: '', tip_obroka: '' }]);
  };

  const handleRemoveStavka = (index) => {
    const updatedStavke = stavke.filter((_, i) => i !== index);
    setStavke(updatedStavke);
  };

  const handleStavkaChange = (index, field, value) => {
    const updatedStavke = stavke.map((stavka, i) =>
      i === index ? { ...stavka, [field]: value } : stavka
    );
    setStavke(updatedStavke);
  };

  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    try {
      const planResponse = await fetch('http://127.0.0.1:8000/api/planovi-obroka', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      const planData = await planResponse.json();
      if (!planResponse.ok) throw planData.errors || { message: 'Greška pri kreiranju plana obroka' };

      const planId = planData.id;
      for (const stavka of stavke) {
        const stavkaResponse = await fetch('http://127.0.0.1:8000/api/stavke-plana', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan_obroka_id: planId, ...stavka }),
        });
        if (!stavkaResponse.ok) {
          const stavkaErr = await stavkaResponse.json();
          throw stavkaErr.errors || { message: 'Greška pri kreiranju stavke plana obroka' };
        }
      }

      alert('Plan obroka i njegove stavke su uspešno kreirane!');
      // Pitaj korisnika da li zeli jos jedan plan
      const wantsAnother = window.confirm('Da li želite da kreirate još jedan plan obroka?');
      if (wantsAnother) {
        // Ako želi još jedan plan, samo resetujemo state i ostanemo na stranici
        setPlan({ naziv: '', period_od: '', period_do: '' });
        setStavke([{ recept_id: '', datum: '', tip_obroka: '' }]);
      } else {
        // Ako ne, preusmeravamo na /planiraj
        navigate('/planiraj');
      }
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="plan-container">
      <div className="plan-overlay">
        <h2>Kreiraj plan obroka</h2>
        {errors && <p style={{ color: 'red' }}>Greška: {JSON.stringify(errors)}</p>}
        {receptiError && <p style={{ color: 'red' }}>Greška: {receptiError}</p>}
        <form onSubmit={handleSubmit}>
          <label>Naziv plana:</label>
          <input type="text" name="naziv" value={plan.naziv} onChange={handlePlanChange} required />
          <label>Period od:</label>
          <input type="date" name="period_od" value={plan.period_od} onChange={handlePlanChange} required />
          <label>Period do:</label>
          <input type="date" name="period_do" value={plan.period_do} onChange={handlePlanChange} required />
          <h3>Stavke plana</h3>
          {stavke.map((stavka, index) => (
            <Stavka
              key={index}
              index={index}
              stavka={stavka}
              recepti={recepti}
              receptiLoading={receptiLoading}
              handleStavkaChange={handleStavkaChange}
              handleRemoveStavka={handleRemoveStavka}
            />
          ))}
          <button type="button" className="add-button" onClick={handleAddStavka}>
            Dodaj Stavku
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Kreiranje...' : 'Kreiraj Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KreirajPlanObroka;
