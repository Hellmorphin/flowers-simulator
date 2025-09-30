import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled(motion.div)`
  background: rgba(255,236,179,0.98);
  border-radius: 2rem;
  box-shadow: 0 8px 32px #6d4c4133;
  min-width: 320px;
  max-width: 90vw;
  min-height: 220px;
  padding: 2.5rem 2rem 2rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #6d4c41;
  cursor: pointer;
  z-index: 10;
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
`;

const ShopModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
  return (
    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalBox initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
        <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
        <Title>Магазин (скоро)</Title>
        <div style={{color:'#6d4c41', opacity:0.7}}>Здесь появятся товары для вашего цветка!</div>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ShopModal;
