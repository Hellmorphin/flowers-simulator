import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ModalOverlay = styled(motion.div)`
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
  background: rgba(255, 236, 179, 0.98);
  border-radius: 2rem;
  box-shadow: 0 8px 32px #6d4c4133;
  min-width: 0;
  max-width: 600px;
  min-height: 200px;
  max-height: 90dvh;
  padding: 2.5rem 3vw 2rem 3vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d7ccc8;
    border-radius: 8px;
  }
  &::-webkit-scrollbar:horizontal {
    height: 0 !important;
    display: none !important;
    background: transparent !important;
  }
  &::-webkit-scrollbar:horizontal {
    display: none;
  }
  @media (max-width: 700px) {
    max-width: calc(100vw + 30px);
    margin-left: -15px;
    margin-right: -15px;
    padding: 2.5rem calc(2vw + 15px) 2rem calc(2vw + 15px);
  }
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
  @media (max-width: 700px) {
    top: -0.9rem;
    right: -0.9rem;
  }
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  width: 100%;
`;

const UpgradeButton = styled.button`
  background: #ffd600;
  color: #6d4c41;
  font-weight: bold;
  border: none;
  border-radius: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.1em;
  box-shadow: 0 2px 8px #a1887f44;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #ffb300;
  }
  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

// Стили для блока уровня
const UpgradeBlock = styled.div`
  width: 100%;
  background: rgba(255, 236, 179, 0.98);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #ffb30033;
  margin-bottom: 18px;
  padding: 15px 12px 12px 11px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Стили для скроллируемой области уровней
const LevelsScrollArea = styled.div`
  width: 100%;
  max-height: 390px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 8px;
  padding-right: 4px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
  }
`;

const LEVELS = [
  { level: 1, price: 500, reward: 10 },
  { level: 2, price: 800, reward: 20 },
  { level: 3, price: 1200, reward: 30 },
  { level: 4, price: 2000, reward: 40 },
  { level: 5, price: 2500, reward: 50 },
  { level: 6, price: 3500, reward: 60 },
  { level: 7, price: 4000, reward: 70 },
  { level: 8, price: 4500, reward: 80 },
  { level: 9, price: 5000, reward: 90 },
  { level: 10, price: 6000, reward: 100 },
  { level: 11, price: 7000, reward: 110 },
  { level: 12, price: 8000, reward: 120 },
  { level: 13, price: 9000, reward: 130 },
  { level: 14, price: 10000, reward: 140 },
  { level: 15, price: 11000, reward: 150 },
  { level: 16, price: 12000, reward: 160 },
  { level: 17, price: 13000, reward: 170 },
  { level: 18, price: 14000, reward: 180 },
  { level: 19, price: 15000, reward: 190 },
  { level: 20, price: 16000, reward: 200 },
];

const AWAKEN_UPGRADE_KEY = "pot_awaken_upgrade";

const AwakenUpgradeModal: React.FC<{
  onClose: () => void;
  coins: number;
  setCoins: (n: number) => void;
  upgradeLevel: number;
  setUpgradeLevel: (n: number) => void;
}> = ({ onClose, coins, setCoins, upgradeLevel, setUpgradeLevel }) => {
  const handleUpgrade = (level: number, price: number) => {
    if (coins < price) return;
    setCoins(coins - price);
    setUpgradeLevel(level);
    localStorage.setItem("progress_coins", String(coins - price));
    localStorage.setItem(AWAKEN_UPGRADE_KEY, String(level));
  };
  // Закрытие по клику вне модального окна
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <ModalOverlay
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
      onClick={handleOverlayClick}
    >
      <ModalBox
        initial={false}
        animate={{ scale: 1 }}
        transition={{ duration: 0 }}
      >
        <CloseBtn
          onClick={() => {
            if (typeof window.playClick2 === "function") window.playClick2();
            onClose();
          }}
        >
          &times;
        </CloseBtn>
        <Title>Пробуждения</Title>
        <LevelsScrollArea>
          {LEVELS.map(({ level, price, reward }) => (
            <UpgradeBlock key={level}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: upgradeLevel >= level ? "#ff9800" : "#cd8c1d",
                }}
              >
                {reward} монет за пробуждение
              </div>
              <UpgradeButton
                disabled={upgradeLevel + 1 !== level || coins < price}
                onClick={() => handleUpgrade(level, price)}
              >
                {upgradeLevel >= level
                  ? "Приобретено"
                  : upgradeLevel + 1 !== level
                  ? "Недоступно"
                  : `Купить за ${price} монет`}
              </UpgradeButton>
            </UpgradeBlock>
          ))}
        </LevelsScrollArea>
      </ModalBox>
    </ModalOverlay>
  );
};

export default AwakenUpgradeModal;
