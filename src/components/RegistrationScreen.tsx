import { API_BASE } from "../apiBase.ts";

import React, { useState, useEffect } from 'react';

const RegistrationScreen: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Проверка: если пользователь уже зарегистрирован, не показывать экран
  useEffect(() => {
    const savedNick = localStorage.getItem('flowersim.user');
    if (savedNick) {
      onAuth();
    }
  }, [onAuth]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!nickname.trim()) {
      setError('Введите ник');
      return;
    }
    try {
  const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (data.user && data.user.nickname) {
        localStorage.setItem('flowersim.user', data.user.nickname);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onAuth();
        }, 1000);
      } else {
        setError(data.error || 'Ошибка');
      }
    } catch {
      setError('Ошибка соединения');
    }
  };

  // Если пользователь уже зарегистрирован, не рендерим компонент
  if (localStorage.getItem('flowersim.user')) return null;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#6d4c41',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 340,
        minWidth: 280,
        width: '100%',
        padding: '48px 24px',
        background: '#fffde7',
        borderRadius: 18,
        boxShadow: '0 2px 16px #a1887f44',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '480px',
        justifyContent: 'center',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 18, color: '#6d4c41' }}>Регистрация</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Введите ник"
            style={{
              width: '100%',
              marginBottom: 18,
              padding: '1.2rem 2.5rem',
              borderRadius: 16,
              border: '1px solid #ffb300',
              background: '#ffecb3',
              color: '#6d4c41',
              fontWeight: 600,
              fontSize: '1.35rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1.2rem 2.5rem',
              borderRadius: 16,
              background: '#ffb300',
              color: '#fff',
              fontWeight: 700,
              border: 'none',
              marginBottom: 8,
              fontSize: '1.35rem',
              boxSizing: 'border-box',
            }}
          >
            Зарегистрироваться
          </button>
        </form>
  {error && <div style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</div>}
  {success && <div style={{ color: '#388e3c', marginTop: 10, textAlign: 'center', fontWeight: 700 }}>Аккаунт успешно создан!</div>}
      </div>
    </div>
  );
};

export default RegistrationScreen;
