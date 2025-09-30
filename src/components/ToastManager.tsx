import React, { useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 4vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToastBox = styled(motion.div)`
  background: #ffecb3;
  color: #6d4c41;
  border-radius: 1.2rem;
  padding: 1.1rem 2.2rem;
  margin-top: 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 16px #a1887f44;
  animation: ${fadeIn} 0.4s;
`;

type Toast = {
  id: number;
  message: string;
};

type ToastManagerProps = {
  children?: React.ReactNode;
};

export const ToastManagerContext = React.createContext<{
  showToast: (msg: string) => void;
} | null>(null);

const ToastManager: React.FC<ToastManagerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message },
    ]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2200);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastManagerContext.Provider value={{ showToast }}>
      <ToastContainer>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastBox
              key={toast.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
            >
              {toast.message}
            </ToastBox>
          ))}
        </AnimatePresence>
      </ToastContainer>
      {children}
    </ToastManagerContext.Provider>
  );
};

export default ToastManager;
