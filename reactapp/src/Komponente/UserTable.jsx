import React, { useState, useEffect } from 'react';
import './UserTable.css';
import UserStatsChart from './UserStatsChart';

const UserTable = () => {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Neuspešno učitavanje korisnika.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Neuspešno brisanje korisnika.');
      }

      setUsers(users.filter((user) => user.id !== userId));
      alert('Korisnik je uspešno obrisan.');
    } catch (err) {
      alert(err.message);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Neuspešno menjanje uloge.');
      }

      const updatedUser = await response.json();
      setUsers(users.map((user) => (user.id === userId ? updatedUser.user : user)));
      alert('Uloga korisnika je uspešno izmenjena.');
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Učitavanje korisnika...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="user-table-container">
      <h2 className="user-table-title">Lista korisnika</h2>
      <UserStatsChart></UserStatsChart>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeUserRole(user.id, e.target.value)}
                >
                  <option value="user">Korisnik</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(user.id)}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
