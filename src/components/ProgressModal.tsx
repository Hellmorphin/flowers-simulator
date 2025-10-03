import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCoins } from 'react-icons/fa';

const ModalBackground = styled.div`
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

const ModalContainer = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 2rem;
  box-shadow: 0 8px 32px #6d4c4133;
  min-width: 0;
  max-width: 600px;
  min-height: 220px;
  max-height: 90dvh;
  padding: 2.5rem 3vw 2rem 3vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  gap: 24px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 700px) {
    max-width: calc(100vw + 30px);
    margin-left: -15px;
    margin-right: -15px;
    padding: 2.5rem calc(2vw + 15px) 2rem calc(2vw + 15px);
  }
`;

const BonusBlock = styled.div`
  background: #f9f6e7;
  border-radius: 12px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const BonusLabel = styled.b`
  color: #ff9800;
  font-weight: 700;
  font-size: 1.08em;
`;

const CoinIcon = styled(FaCoins)`
  color: #FFD700;
  font-size: 1.6em;
  margin-right: 8px;
`;

const BonusButton = styled.button`
  background: #222;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  font-size: 1em;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin: 0.7rem 0;
  width: 60%;
  max-width: 180px;
  transition: background 0.2s;
  display: block;
  &:hover {
    background: #444;
  }
  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #6d4c41;
  width: 100%;
`;

const TimerText = styled.span`
  font-size: 0.98em;
  color: #888;
  margin-left: 12px;
`;

function getTimeLeft(target: number) {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return 'Доступно!';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours}ч ${minutes}м ${seconds}с`;
}

const DAILY_KEY = 'progress_daily_bonus';
const WEEKLY_KEY = 'progress_weekly_bonus';
const COINS_KEY = 'progress_coins';

const getNextDaily = () => {
  const last = Number(localStorage.getItem(DAILY_KEY) || 0);
  return last + 24 * 3600 * 1000;
};
const getNextWeekly = () => {
  const last = Number(localStorage.getItem(WEEKLY_KEY) || 0);
  return last + 7 * 24 * 3600 * 1000;
};

export interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  const [dailyReady, setDailyReady] = useState<boolean>(false);
  const [weeklyReady, setWeeklyReady] = useState<boolean>(false);
  const [dailyTimer, setDailyTimer] = useState<string>('');
  const [weeklyTimer, setWeeklyTimer] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const updateTimers = () => {
      const nextDaily = getNextDaily();
      const nextWeekly = getNextWeekly();
      const dailyText = getTimeLeft(nextDaily);
      const weeklyText = getTimeLeft(nextWeekly);
      setDailyReady(dailyText === 'Доступно!');
      setWeeklyReady(weeklyText === 'Доступно!');
      setDailyTimer(dailyText);
      setWeeklyTimer(weeklyText);
    };
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDailyBonus = () => {
    const current = Number(localStorage.getItem(COINS_KEY) || 0);
    localStorage.setItem(COINS_KEY, String(current + 10));
    localStorage.setItem(DAILY_KEY, String(Date.now()));
    setDailyReady(false);
  };

  const handleWeeklyBonus = () => {
    const current = Number(localStorage.getItem(COINS_KEY) || 0);
    localStorage.setItem(COINS_KEY, String(current + 50));
    localStorage.setItem(WEEKLY_KEY, String(Date.now()));
    setWeeklyReady(false);
  };

  if (!isOpen) return null;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Title>Прогресс</Title>
        <BonusBlock>
          <div>
            <CoinIcon />
            <BonusLabel>Ежедневный бонус</BonusLabel>
            <TimerText>{dailyTimer}</TimerText>
          </div>
          <BonusButton disabled={!dailyReady} onClick={handleDailyBonus}>
            Получить +10
          </BonusButton>
        </BonusBlock>
        <BonusBlock>
          <div>
            <CoinIcon />
            <BonusLabel>Еженедельный бонус</BonusLabel>
            <TimerText>{weeklyTimer}</TimerText>
          </div>
          <BonusButton disabled={!weeklyReady} onClick={handleWeeklyBonus}>
            Получить +50
          </BonusButton>
        </BonusBlock>
        <BonusButton onClick={onClose} style={{ marginTop: 12 }}>Закрыть</BonusButton>
      </ModalContainer>
    </ModalBackground>
  );
};

export default ProgressModal;
