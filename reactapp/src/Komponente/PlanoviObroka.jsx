import React, { useState } from 'react';
import usePlanoviObroka from './usePlanoviObroka';
import PlanCard from './PlanCard';
import './PlanoviObroka.css';

const PlanoviObroka = () => {
  const token = localStorage.getItem('token');
  const [filters, setFilters] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null); // Držimo trenutno odabrani plan

  const { planovi, pagination, isLoading, error, fetchPlanovi } = usePlanoviObroka(token, filters);

  const handlePageChange = (newPage) => {
    fetchPlanovi(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchPlanovi();
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="planovi-container">
      <h1 className="planovi-title">Planovi obroka</h1>

      {/* Filter forma */}
      <form className="filter-form" onSubmit={handleFilterApply}>
        <div className="filter-field">
          <label htmlFor="naziv">Naziv:</label>
          <input
            type="text"
            id="naziv"
            name="naziv"
            value={filters.naziv || ''}
            onChange={handleFilterChange}
            placeholder="Pretraži po nazivu..."
          />
        </div>
        <button type="submit" className="filter-button">Primeni filtere</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {isLoading && <p className="loading-message">Učitavanje...</p>}

      {!isLoading && planovi.length > 0 && (
        <div className="planovi-list">
          {planovi.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onClick={() => handlePlanClick(plan)} />
          ))}
        </div>
      )}

      {pagination && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            Prethodna
          </button>
          <span className="pagination-info">
            Strana {pagination.current_page} od {pagination.last_page}
          </span>
          <button
            className="pagination-button"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            Sledeća
          </button>
        </div>
      )}

      {/* Prikaz stavki odabranog plana */}
      {selectedPlan && (
        <div className="plan-stavke">
          <h2>Stavke plana: {selectedPlan.naziv}</h2>
          <ul>
          {selectedPlan.stavke_plana.map((stavka) => {
              const sastojci = JSON.parse(stavka.recept.sastojci || '[]'); // Parsiranje stringa u niz
              const nutritivneVrednosti = JSON.parse(stavka.recept.nutritivne_vrednosti || '{}'); // Parsiranje nutritivnih vrednosti

              return (
                <li key={stavka.id} className="stavka-item">
                  <strong>Datum:</strong> {stavka.datum}, <strong>Tip obroka:</strong> {stavka.tip_obroka}
                  <div className="stavka-recept">
                    <h4>Recept: {stavka.recept.naziv}</h4>
                    <p><strong>Opis:</strong> {stavka.recept.opis}</p>
                    <p>
                      <strong>Nutritivne vrednosti:</strong> Kalorije: {nutritivneVrednosti.kalorije || 'N/A'}, 
                      Proteini: {nutritivneVrednosti.proteini || 'N/A'}, 
                      Masti: {nutritivneVrednosti.masti || 'N/A'}, 
                      Ugljeni hidrati: {nutritivneVrednosti.ugljeni_hidrati || 'N/A'}
                    </p>
                    <p><strong>Sastojci:</strong> {sastojci.join(', ')}</p>
                  </div>
                </li>
              );
            })}

          </ul>
        </div>
      )}
    </div>
  );
};

export default PlanoviObroka;
