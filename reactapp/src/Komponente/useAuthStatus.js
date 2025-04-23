import { useState, useEffect } from 'react';

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
    return () => {
      authState.listeners.delete(updateState);
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
