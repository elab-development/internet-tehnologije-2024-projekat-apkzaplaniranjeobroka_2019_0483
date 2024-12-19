import { useState, useEffect } from 'react';

const useRecepti = (token) => {
  const [recepti, setRecepti] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecepti = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/recepti', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Greška pri učitavanju recepata.');
        }

        setRecepti(data); // Pretpostavlja se da je `data.data` lista recepata
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecepti();
  }, [token]);

  return { recepti, isLoading, error };
};

export default useRecepti;
