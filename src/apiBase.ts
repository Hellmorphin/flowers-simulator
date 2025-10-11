// src/apiBase.ts
// Универсальный базовый URL для API: работает и локально, и на проде

const getApiBase = () => {
  // 1. Если явно задан REACT_APP_API_URL — используем его
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // 2. Если сайт открыт с localhost — используем локальный backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001/api';
  }
  // 3. Иначе — используем продовый backend (замените на свой адрес)
  return 'https://gorshock.onrender.com/api';
};

export const API_BASE = getApiBase();
