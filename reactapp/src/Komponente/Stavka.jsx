import React from 'react';

const Stavka = ({ stavka, index, recepti, receptiLoading, handleStavkaChange, handleRemoveStavka }) => {
  return (
    <div className="stavka-card">
      <div className="stavka-row">
        <div className="stavka-field">
          <label>Recept:</label>
          <select
            value={stavka.recept_id}
            onChange={(e) => handleStavkaChange(index, 'recept_id', e.target.value)}
            required
          >
            <option value="">Izaberi recept</option>
            {receptiLoading ? (
              <option disabled>Učitavanje...</option>
            ) : (
              recepti.map((recept) => (
                <option key={recept.id} value={recept.id}>
                  {recept.naziv}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="stavka-field">
          <label>Datum:</label>
          <input
            type="date"
            value={stavka.datum}
            onChange={(e) => handleStavkaChange(index, 'datum', e.target.value)}
            required
          />
        </div>
        <div className="stavka-field">
          <label>Tip obroka:</label>
          <input
            type="text"
            value={stavka.tip_obroka}
            onChange={(e) => handleStavkaChange(index, 'tip_obroka', e.target.value)}
            required
          />
        </div>
      </div>
      <button type="button" className="remove-button" onClick={() => handleRemoveStavka(index)}>
        Ukloni
      </button>
    </div>
  );
};

export default Stavka;
