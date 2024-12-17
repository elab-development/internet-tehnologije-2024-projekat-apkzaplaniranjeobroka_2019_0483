import React, { useState } from 'react';

const KreirajPlanObroka = ( ) => {
    const token= localStorage.getItem('token')
  const [plan, setPlan] = useState({
    naziv: '',
    period_od: '',
    period_do: '',
  });

  const [stavke, setStavke] = useState([
    { recept_id: '', datum: '', tip_obroka: '' },
  ]);

  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dodavanje nove stavke plana
  const handleAddStavka = () => {
    setStavke([...stavke, { recept_id: '', datum: '', tip_obroka: '' }]);
  };

  // Promena vrednosti stavki plana
  const handleStavkaChange = (index, field, value) => {
    const updatedStavke = stavke.map((stavka, i) =>
      i === index ? { ...stavka, [field]: value } : stavka
    );
    setStavke(updatedStavke);
  };

  // Promena vrednosti plana
  const handlePlanChange = (e) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  // Slanje podataka na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    try {
      // Korak 1: Kreiranje plana obroka
      const planResponse = await fetch('http://127.0.0.1:8000/api/planovi-obroka', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      const planData = await planResponse.json();

      if (!planResponse.ok) {
        throw planData.errors || { message: 'Greška pri kreiranju plana obroka' };
      }

      const planId = planData.data.id;

      // Korak 2: Kreiranje stavki plana
      for (const stavka of stavke) {
        await fetch('http://127.0.0.1:8000/api/stavke-plana', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan_obroka_id: planId,
            ...stavka,
          }),
        });
      }

      alert('Plan obroka i njegove stavke su uspešno kreirane!');
      setPlan({ naziv: '', period_od: '', period_do: '' });
      setStavke([{ recept_id: '', datum: '', tip_obroka: '' }]);
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Kreiraj Plan Obroka</h2>
      {errors && <p style={{ color: 'red' }}>Greška: {JSON.stringify(errors)}</p>}
      <form onSubmit={handleSubmit}>
        {/* Forma za plan obroka */}
        <div>
          <label>Naziv plana:</label>
          <input
            type="text"
            name="naziv"
            value={plan.naziv}
            onChange={handlePlanChange}
            required
          />
        </div>
        <div>
          <label>Period od:</label>
          <input
            type="date"
            name="period_od"
            value={plan.period_od}
            onChange={handlePlanChange}
            required
          />
        </div>
        <div>
          <label>Period do:</label>
          <input
            type="date"
            name="period_do"
            value={plan.period_do}
            onChange={handlePlanChange}
            required
          />
        </div>

        <h3>Stavke plana</h3>
        {stavke.map((stavka, index) => (
          <div key={index}>
            <div>
              <label>Recept ID:</label>
              <input
                type="number"
                value={stavka.recept_id}
                onChange={(e) =>
                  handleStavkaChange(index, 'recept_id', e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Datum:</label>
              <input
                type="date"
                value={stavka.datum}
                onChange={(e) =>
                  handleStavkaChange(index, 'datum', e.target.value)
                }
                required
              />
            </div>
            <div>
              <label>Tip obroka:</label>
              <input
                type="text"
                value={stavka.tip_obroka}
                onChange={(e) =>
                  handleStavkaChange(index, 'tip_obroka', e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddStavka}>
          Dodaj Stavku
        </button>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Kreiranje...' : 'Kreiraj Plan'}
        </button>
      </form>
    </div>
  );
};

export default KreirajPlanObroka;
