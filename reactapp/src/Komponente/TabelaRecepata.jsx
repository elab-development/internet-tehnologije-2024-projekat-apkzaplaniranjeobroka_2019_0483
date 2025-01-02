import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ModalRecept from './ModalRecept';
import './TabelaRecepata.css';

const TabelaRecepata = () => {
  const token = localStorage.getItem('token');
  const [recepti, setRecepti] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecepti = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/recepti', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRecepti(data);
    } catch (err) {
      setError('Greška pri učitavanju recepata.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecepti();
  }, []);

  const handleReceptKreiran = (noviRecept) => {
    setRecepti((prevRecepti) => [noviRecept, ...prevRecepti]);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'naziv', headerName: 'Naziv', width: 200 },
    { field: 'opis', headerName: 'Opis', width: 300 },
    {
      field: 'sastojci',
      headerName: 'Sastojci',
      width: 250,
      renderCell: (params) => params.value.join(', '),
    },
    {
      field: 'nutritivne_vrednosti',
      headerName: 'Nutritivne vrednosti',
      width: 400,
      renderCell: (params) =>
        `Kalorije: ${params.value.kalorije || 'N/A'}, Proteini: ${params.value.proteini || 'N/A'}, Masti: ${params.value.masti || 'N/A'}, Ugljeni hidrati: ${params.value.ugljeni_hidrati || 'N/A'}`,
    },
  ];

  return (
    <div className="recepti-container">
      <h1 className="recepti-title">Lista Recepata</h1>
      <button className="create-recept-button" onClick={handleOpenModal}>
        Dodaj novi recept
      </button>

      {isLoading && <p className="loading-message">Učitavanje recepata...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={recepti}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      )}

      <ModalRecept
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReceptKreiran={handleReceptKreiran}
      />
    </div>
  );
};

export default TabelaRecepata;
