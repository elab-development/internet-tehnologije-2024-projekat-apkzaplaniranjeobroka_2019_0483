import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Komponente/HomePage';
import LoginPage from './Komponente/LoginPage';
import ContactPage from './Komponente/ContactPage';
import RegisterPage from './Komponente/RegisterPage';
import Navbar from './Komponente/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
