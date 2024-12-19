import React, { useState } from 'react';
import usePlanoviObroka from './usePlanoviObroka';
import PlanCard from './PlanCard';  
import './PlanoviObroka.css'; 

const PlanoviObroka = () => {
  const token = localStorage.getItem('token');
  const [filters, setFilters] = useState({});

  const { planovi, pagination, isLoading, error, fetchPlanovi } = usePlanoviObroka(token, filters);

  const handlePageChange = (newPage) => {
    fetchPlanovi(newPage);
  };

  // Handler za promenu filter input polja
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handler za primenu filtera
  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchPlanovi();
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
            <PlanCard key={plan.id} plan={plan} />
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
    </div>
  );
};

export default PlanoviObroka;
