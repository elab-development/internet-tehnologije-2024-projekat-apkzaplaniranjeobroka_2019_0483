import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Komponente/HomePage';
import LoginPage from './Komponente/LoginPage';
import ContactPage from './Komponente/ContactPage';
import RegisterPage from './Komponente/RegisterPage';
import Navbar from './Komponente/Navbar';
import PlanoviObroka from './Komponente/PlanoviObroka';
import KreirajPlanObroka from './Komponente/KreirajPlanObroka';
import useAuthStatus from './Komponente/useAuthStatus';
import { useEffect, useState } from 'react';

function App() {
  const { isLoggedIn, user, token } = useAuthStatus();
  const [authKey, setAuthKey] = useState(0); // Ključ za ponovno renderovanje aplikacije

  useEffect(() => {
    setAuthKey((prev) => prev + 1); // Povećanje ključa kada se `authState` promeni
  }, [isLoggedIn, user, token]);
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/planiraj" element={<PlanoviObroka />} />
          <Route path="/kreirajPlan" element={<KreirajPlanObroka />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
