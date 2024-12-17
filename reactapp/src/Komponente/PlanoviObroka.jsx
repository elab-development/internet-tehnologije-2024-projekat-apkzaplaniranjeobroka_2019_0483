import React, { useEffect, useState } from 'react';
import usePlanoviObroka from './usePlanoviObroka';

const PlanoviObroka = ( ) => {
    const token= localStorage.getItem('token')
  const [filters, setFilters] = useState({}); // Početni filteri
  const { planovi, pagination, isLoading, error, fetchPlanovi } = usePlanoviObroka(token, filters);

  const handlePageChange = (newPage) => {
    fetchPlanovi(newPage); // Ručno učitavanje podataka za novu stranicu
  };

  return (
    <div>
      <h1>Planovi Obroka</h1>

      {/* Prikaz greške */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Prikaz učitavanja */}
      {isLoading && <p>Učitavanje...</p>}

      {/* Prikaz liste planova */}
      {!isLoading && planovi.length > 0 && (
        <ul>
          {planovi.map((plan) => (
            <li key={plan.id}>
              {plan.naziv} - {plan.period_od} do {plan.period_do}
            </li>
          ))}
        </ul>
      )}

      {/* Prikaz paginacije */}
      {pagination && (
        <div>
          <button
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            Prethodna
          </button>
          <span>
            Strana {pagination.current_page} od {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanoviObroka;
