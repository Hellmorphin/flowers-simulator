import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

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

const ModalText = styled.div`
  margin-top: 36px;
  color: #6d4c41;
  font-size: 1.18rem;
  text-align: center;
  background: #fcdf8b;
  border-radius: 1.2rem;
  padding: 10px 10px 10px 10px;
  box-shadow: 0 2px 8px #a1887f33;
  min-width: 200px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`;

const ModalTitle = styled.h3`
  color: #ff9800;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const ModalButton = styled.button`
  background: #d59527;
  color: #6d4c41;
  font-size: 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 2rem;
  padding: 1rem 2.5rem;
  margin: 0.5rem 0;
  box-shadow: 0 4px 16px #a1887f44;
  cursor: pointer;
  transition: box-shadow 0.18s, background 0.18s;
  outline: none;
  user-select: none;
  width: 48%;
  display: inline-block;
  &:focus {
    outline: none;
    box-shadow: 0 4px 16px #a1887f44;
  }
  &:hover {
    background: #d59527;
    box-shadow: 0 8px 32px #a1887f99;
  }
  &.active {
    background: #ffe082;
  }
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

interface HowToPlayModalProps {
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [show, setShow] = useState<null | "rules" | "features">(null);
  // Функция для закрытия по клику вне модалки
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
          animate={{
            scale: 1,
            boxShadow: "0 2px 16px #a1887f44",
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        >
          <CloseBtn onClick={onClose} title="Закрыть">
            ×
          </CloseBtn>
          <ModalTitle>Как играть</ModalTitle>
          <div
            style={{
              display: "flex",
              gap: 12,
              width: "100%",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <ModalButton
              className={show === "rules" ? "active" : ""}
              onClick={() => setShow("rules")}
            >
              Правила игры
            </ModalButton>
            <ModalButton
              className={show === "features" ? "active" : ""}
              onClick={() => setShow("features")}
            >
              Фукции
            </ModalButton>
          </div>
          <AnimatePresence>
            {show === "rules" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              >
                <ModalText>
                  Суть игры заключается в выращивании разных растений. Покупке
                  дикараций и прокачке горшка.
                </ModalText>
              </motion.div>
            )}
            {show === "features" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              >
                <ModalText>
                  Возможность выращивать, прокачивать, растить цветы не находясь
                  постоянно в игре. Игра работает в офлайин режиме.
                </ModalText>
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBox>
      </AnimatePresence>
    </ModalBg>
  );
};

export default HowToPlayModal;
