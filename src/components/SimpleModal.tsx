import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled(motion.div)`
  background: #ffecb3;
  border-radius: 2rem;
  box-shadow: 0 2px 16px #a1887f44;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 95vw;
  min-width: 380px;
  width: 500px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 24px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #000000;
  cursor: pointer;
  z-index: 10;
`;

const ModalTitle = styled.h3`
  color: #ff9800;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const ModalText = styled.div`
  margin-top: 28px;
  color: #6d4c41;
  font-size: 1.18rem;
  text-align: center;
  background: #fcdf8b;
  border-radius: 1.2rem;
  padding: 24px 24px 20px 24px;
  box-shadow: 0 2px 8px #a1887f33;
  min-width: 320px;
  max-width: 420px;
  min-height: 110px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`;

interface SimpleModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ onClose, title, children }) => {
  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <ModalBg onClick={handleBgClick}>
      <AnimatePresence>
        <ModalBox
          as={motion.div}
          initial={{ scale: 1 }}
          animate={{ scale: 1, boxShadow: "0 2px 16px #a1887f44" }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
          <ModalTitle>{title}</ModalTitle>
          <ModalText>{children}</ModalText>
        </ModalBox>
      </AnimatePresence>
    </ModalBg>
  );
};

export default SimpleModal;
