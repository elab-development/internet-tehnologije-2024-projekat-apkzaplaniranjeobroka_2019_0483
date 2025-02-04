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
  const [initialData, setInitialData] = useState(null);

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
    setInitialData(null);
  };

  const handleReceptIzmenjen = (izmenjenRecept) => {
    setRecepti((prevRecepti) =>
      prevRecepti.map((recept) =>
        recept.id === izmenjenRecept.id ? izmenjenRecept : recept
      )
    );
    setIsModalOpen(false);
    setInitialData(null);
  };

  const handleDeleteRecept = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/recepti/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecepti((prevRecepti) => prevRecepti.filter((recept) => recept.id !== id));
    } catch (err) {
      setError('Greška pri brisanju recepta.');
    }
  };

  const handleOpenModal = () => {
    setInitialData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInitialData(null);
  };

  const handleEditRecept = (recept) => {
    setInitialData(recept);
    setIsModalOpen(true);
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
    {
      field: 'actions',
      headerName: 'Akcije',
      width: 200,
      renderCell: (params) => (
        <div className="actions-container">
          <button
            className="edit-button"
            onClick={() => handleEditRecept(params.row)}
          >
            Izmeni
          </button>
          <button
            className="delete-button"
            onClick={() => handleDeleteRecept(params.row.id)}
          >
            Obriši
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="recepti-container">
      <h1 className="recepti-title">Lista recepata</h1>
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
        onReceptIzmenjen={handleReceptIzmenjen}
        initialData={initialData}
      />
    </div>
  );
};

export default TabelaRecepata;