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
import TabelaRecepata from './Komponente/TabelaRecepata';
import RecipeRecommendation from './Komponente/RecipeRecommendation';
import UserTable from './Komponente/UserTable';
import Breadcrumbs from './Komponente/Breadcrumbs';
 
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
      <Breadcrumbs></Breadcrumbs>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/planiraj" element={<PlanoviObroka />} />     {/*za seminarski dopunjeno sa funkcionalnoscu za preuzimanje pdfa */}
          <Route path="/kreirajPlan" element={<KreirajPlanObroka />} />

          <Route path="/recepti/preporuke" element={<RecipeRecommendation />} />

          <Route path="/recepti" element={<TabelaRecepata />} />
         
          <Route path="/users" element={<UserTable />} />




        </Routes>
      </div>
    </Router>
  );
}

export default App;
