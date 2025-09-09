 
import { useEffect, useState } from 'react';

// Singleton za stanje autentifikacije
const authState = {
  isLoggedIn: false,
  user: null,
  token: null,
  listeners: new Set(),
  notify() {
    this.listeners.forEach((listener) => listener());
  },
};

// ucitava podatke iz localStorage (radi i na prvom renderu posle refresh-a)
try {
  const t = localStorage.getItem('token');
  const u = localStorage.getItem('user');
  if (t && u) {
    authState.isLoggedIn = true;
    authState.token = t;
    authState.user = JSON.parse(u);
  }
} catch { /* ignore */ }

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);
  const [user, setUser] = useState(authState.user);
  const [token, setToken] = useState(authState.token);

  const updateState = () => {
    setIsLoggedIn(authState.isLoggedIn);
    setUser(authState.user);
    setToken(authState.token);
  };

  useEffect(() => {
    authState.listeners.add(updateState);

    //  sync kad se localStorage promeni iz drugog taba
    const onStorage = () => {
      try {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        authState.isLoggedIn = !!(t && u);
        authState.token = t || null;
        authState.user = u ? JSON.parse(u) : null;
        authState.notify();
      } catch {}
    };
    window.addEventListener('storage', onStorage);

    return () => {
      authState.listeners.delete(updateState);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    authState.isLoggedIn = true;
    authState.token = newToken;
    authState.user = userData;

    authState.notify();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    authState.isLoggedIn = false;
    authState.token = null;
    authState.user = null;

    authState.notify();
  };

  return { isLoggedIn, user, token, login, logout };
};

export default useAuthStatus;
