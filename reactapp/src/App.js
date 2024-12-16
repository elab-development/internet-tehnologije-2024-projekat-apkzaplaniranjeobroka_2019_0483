import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Komponente/HomePage';
import LoginPage from './Komponente/LoginPage';
import ContactPage from './Komponente/ContactPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
