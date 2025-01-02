import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  const handleDownloadPDF = () => {
    if (!selectedPlan) return;
  
    const doc = new jsPDF({ orientation: 'landscape' });
  
    // Naslov PDF-a
    doc.setFontSize(18);
    doc.setTextColor(255, 92, 92); // Koristi boju iz CSS-a
    doc.text(`  ${selectedPlan.naziv}`, 14, 15);
  
    // Datum perioda
    doc.setFontSize(14);
    doc.setTextColor(51, 51, 51);
    doc.text(`Period: ${selectedPlan.period_od} - ${selectedPlan.period_do}`, 14, 25);
  
    // Priprema podataka za tabelu
    const tableData = selectedPlan.stavke_plana.map((stavka) => {
      const sastojci = JSON.parse(stavka.recept.sastojci || '[]').join(', ');
      const nutritivneVrednosti = JSON.parse(stavka.recept.nutritivne_vrednosti || '{}');
  
      return [
        stavka.datum,
        stavka.tip_obroka,
        stavka.recept.naziv,
        sastojci,
        nutritivneVrednosti.kalorije || 'N/A',
        nutritivneVrednosti.proteini || 'N/A',
        nutritivneVrednosti.masti || 'N/A',
        nutritivneVrednosti.ugljeni_hidrati || 'N/A',
      ];
    });
  
    // Dodavanje tabele u PDF
    doc.autoTable({
      head: [['Datum', 'Tip obroka', 'Recept', 'Sastojci', 'Kalorije', 'Proteini', 'Masti', 'Ugljeni hidrati']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center',
      },
      headStyles: {
        fillColor: [255, 92, 92], // Boja zaglavlja
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [247, 247, 247], // Siva pozadina za alternativne redove
      },
    });
  
    // Preuzimanje PDF fajla
    doc.save(`${selectedPlan.naziv}-plan-obroka.pdf`);
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
          <button className="download-pdf-button" onClick={handleDownloadPDF}>
            Preuzmi PDF
          </button>
          <ul>
            {selectedPlan.stavke_plana.map((stavka) => {
              const sastojci = JSON.parse(stavka.recept.sastojci || '[]');
              const nutritivneVrednosti = JSON.parse(stavka.recept.nutritivne_vrednosti || '{}');

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
