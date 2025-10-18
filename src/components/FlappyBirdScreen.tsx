const ScoreBadge = styled.div`
  position: absolute;
  top: 106px;
  right: 16px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffecb3;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 1.05rem;
  pointer-events: none;
  z-index: 10001;
`;

import React, { useState } from "react";
import FlappyBirdGame from "./FlappyBirdGame";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";

const GameWrapper = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #faf5e6;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CountdownScreen = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(4rem, 12vw, 8rem);
  color: #ffecb3;
  font-weight: 800;
  pointer-events: none;
  text-shadow: 0 12px 28px #00000055;
`;

const GameOverPanel = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(2px);
`;

const GameOverCard = styled.div`
  background: rgba(255, 244, 214, 0.98);
  border-radius: 22px;
  box-shadow: 0 20px 50px #00000033;
  padding: 36px 32px 28px;
  max-width: 340px;
  width: 100%;
  text-align: center;
`;

const GameOverTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 1.7rem;
  color: #6d4c41;
`;

const RewardText = styled.div`
  font-size: 1.2rem;
  color: #4e342e;
  margin-top: 10px;
  font-weight: 600;
`;

const RewardValue = styled.div`
  font-size: 2rem;
  color: #ff6f00;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 6px 0 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: #ffb300;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 170px;
  box-shadow: 0 8px 18px #ffb30044;
  transition: transform 0.15s ease, background 0.15s ease;
  &:hover {
    background: #ffa000;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(1px);
  }
`;

interface FlappyBirdScreenProps {
  onExit?: () => void;
  onWin?: (coins: number) => void;
}

const FlappyBirdScreen: React.FC<FlappyBirdScreenProps> = ({ onExit, onWin }) => {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  React.useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(
        () => setCountdown((prev) => (prev ?? 0) - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setCountdown(null);
      setShowGame(true);
    }, 700);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <GameWrapper>
      {/* Canvas всегда виден, даже после проигрыша */}
      <FlappyBirdGame onGameOver={setScore} gameStarted={showGame} />
      {/* Счёт поверх canvas убран по просьбе пользователя */}
      {/* Таймер поверх canvas */}
      {!showGame && (
        <CountdownScreen>
          {countdown !== null && (countdown > 0 ? countdown : "Go!")}
        </CountdownScreen>
      )}
      {/* Мадалка окончания игры поверх canvas */}
      {score !== null && (
        <GameOverPanel>
          <GameOverCard>
            <GameOverTitle>Заработано</GameOverTitle>
            <div style={{ color: "#6d4c41", fontWeight: 600, marginBottom: 6 }}>
              Счёт: {score}
            </div>
            <RewardText>Награда</RewardText>
            <RewardValue>
              <FaCoins size={22} /> {score}
            </RewardValue>
            <ButtonRow>
              <ActionButton
                onClick={() => {
                  if (onWin && score && score > 0) {
                    onWin(score);
                  }
                  if (onExit) onExit();
                }}
              >
                Забрать
              </ActionButton>
            </ButtonRow>
          </GameOverCard>
        </GameOverPanel>
      )}
    </GameWrapper>
  );
};

export default FlappyBirdScreen;
