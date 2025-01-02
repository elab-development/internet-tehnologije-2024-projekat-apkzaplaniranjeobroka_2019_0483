import React, { useState } from 'react';
import useRecepti from './useRecepti';
import ModalRecept from './ModalRecept';
import './TabelaRecepata.css';

const TabelaRecepata = () => {
  const token = localStorage.getItem('token'); // Dohvatanje tokena iz lokalnog skladišta
  const { recepti, isLoading, error } = useRecepti(token); // Korišćenje kuke za učitavanje recepata
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleReceptKreiran = (noviRecept) => {
    // Osvježava listu recepata - ovde možeš dodati logiku za ponovno učitavanje
    console.log('Recept kreiran:', noviRecept);
  };

  return (
    <div className="recepti-container">
      <h1 className="recepti-title">Lista Recepata</h1>
      <button className="create-recept-button" onClick={handleOpenModal}>
        Dodaj novi recept
      </button>

      {isLoading && <p className="loading-message">Učitavanje recepata...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && recepti.length > 0 && (
        <table className="recepti-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Naziv</th>
              <th>Opis</th>
              <th>Sastojci</th>
              <th>Nutritivne vrednosti</th>
            </tr>
          </thead>
          <tbody>
            {recepti.map((recept) => (
              <tr key={recept.id}>
                <td>{recept.id}</td>
                <td>{recept.naziv}</td>
                <td>{recept.opis || 'N/A'}</td>
                <td>{recept.sastojci.join(', ')}</td>
                <td>
                  {`Kalorije: ${recept.nutritivne_vrednosti.kalorije || 'N/A'}, 
                  Proteini: ${recept.nutritivne_vrednosti.proteini || 'N/A'}, 
                  Masti: ${recept.nutritivne_vrednosti.masti || 'N/A'}, 
                  Ugljeni hidrati: ${recept.nutritivne_vrednosti.ugljeni_hidrati || 'N/A'}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && recepti.length === 0 && <p className="no-data-message">Nema dostupnih recepata.</p>}

      <ModalRecept
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReceptKreiran={handleReceptKreiran}
      />
    </div>
  );
};

export default TabelaRecepata;
