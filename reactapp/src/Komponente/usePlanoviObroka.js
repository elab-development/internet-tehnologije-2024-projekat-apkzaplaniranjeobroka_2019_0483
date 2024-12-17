import { useState, useEffect } from 'react';

const usePlanoviObroka = (token, filters = {}) => {
  const [planovi, setPlanovi] = useState([]); // Planovi obroka
  const [pagination, setPagination] = useState(null); // Podaci o paginaciji
  const [isLoading, setIsLoading] = useState(false); // Da li se učitava
  const [error, setError] = useState(null); // Greška prilikom učitavanja

  const fetchPlanovi = async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page,
      }).toString();

      const response = await fetch(
        `http://127.0.0.1:8000/api/planovi-obroka?${queryParams}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri učitavanju planova obroka');
      }

      setPlanovi(data.data); // Postavljanje planova
      setPagination(data.pagination); // Paginacija
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanovi();
  }, [token, JSON.stringify(filters)]); // Re-fetch ako se token ili filteri promene

  return { planovi, pagination, isLoading, error, fetchPlanovi };
};

export default usePlanoviObroka;
