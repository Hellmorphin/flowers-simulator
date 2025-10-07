import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import CaseRouletteModal from "./CaseRouletteModal";
import { motion } from "framer-motion";

const isAndroid =
  typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

const ModalBackground = styled(motion.div)`
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

const ModalContainer = styled(motion.div)`
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
  gap: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 8px;
    background: #ffe4b2;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffd180;
    border-radius: 8px;
  }
  @media (max-width: 700px) {
    max-width: calc(100vw + 30px);
    margin-left: -15px;
    margin-right: -15px;
    padding: 2.5rem calc(2vw + 15px) 2rem calc(2vw + 15px);
  }
`;

const BonusBlocksRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;
  width: 100%;
  justify-content: center;
  margin-bottom: 16px;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
`;

const BonusScrollArea = styled.div`
  width: 100%;
  max-height: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 8px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BonusBlock = styled.div`
  background: rgba(255, 236, 179, 0.98);
  box-shadow: 0 2px 12px #ffb30033;
  border-radius: 12px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 260px;
  max-width: 140px;
  width: 100%;
`;

const BonusLabel = styled.b`
  color: #ff9800;
  font-weight: 700;
  font-size: 1.08em;
`;

const CoinIcon = styled(FaCoins)`
  color: #ffd700;
  font-size: 2em;
  margin-bottom: 2px;
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
  width: 120%;
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

const TimerText = styled.div`
  font-size: 0.98em;
  color: #888;
  margin-top: 4px;
  text-align: center;
`;

function getTimeLeft(target: number) {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return "Доступно!";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours}ч ${minutes}м`;
  return `${minutes}м`;
}

const DAILY_KEY = "progress_daily_bonus";
const WEEKLY_KEY = "progress_weekly_bonus";
const DAILY_CASE_KEY = "progress_daily_case";
const WEEKLY_CASE_KEY = "progress_weekly_case";
const COINS_KEY = "progress_coins";

const getNextDaily = () => {
  const last = Number(localStorage.getItem(DAILY_KEY) || 0);
  return last + 24 * 3600 * 1000;
};
const getNextWeekly = () => {
  const last = Number(localStorage.getItem(WEEKLY_KEY) || 0);
  return last + 7 * 24 * 3600 * 1000;
};
const getNextDailyCase = () => {
  const last = Number(localStorage.getItem(DAILY_CASE_KEY) || 0);
  return last + 24 * 3600 * 1000;
};
const getNextWeeklyCase = () => {
  const last = Number(localStorage.getItem(WEEKLY_CASE_KEY) || 0);
  return last + 7 * 24 * 3600 * 1000;
};

export interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  const [dailyReady, setDailyReady] = useState<boolean>(false);
  const [weeklyReady, setWeeklyReady] = useState<boolean>(false);
  const [dailyTimer, setDailyTimer] = useState<string>("");
  const [weeklyTimer, setWeeklyTimer] = useState<string>("");
  const [showCase, setShowCase] = useState<null | "daily" | "weekly">(null);
  const [caseReward, setCaseReward] = useState<number | null>(null);
  const [dailyCaseReady, setDailyCaseReady] = useState<boolean>(false);
  const [weeklyCaseReady, setWeeklyCaseReady] = useState<boolean>(false);
  const [dailyCaseTimer, setDailyCaseTimer] = useState<string>("");
  const [weeklyCaseTimer, setWeeklyCaseTimer] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    const updateTimers = () => {
      const nextDaily = getNextDaily();
      const nextWeekly = getNextWeekly();
      const nextDailyCase = getNextDailyCase();
      const nextWeeklyCase = getNextWeeklyCase();
      const dailyText = getTimeLeft(nextDaily);
      const weeklyText = getTimeLeft(nextWeekly);
      const dailyCaseText = getTimeLeft(nextDailyCase);
      const weeklyCaseText = getTimeLeft(nextWeeklyCase);
      setDailyReady(dailyText === "Доступно!");
      setWeeklyReady(weeklyText === "Доступно!");
      setDailyTimer(dailyText);
      setWeeklyTimer(weeklyText);
      setDailyCaseReady(dailyCaseText === "Доступно!");
      setWeeklyCaseReady(weeklyCaseText === "Доступно!");
      setDailyCaseTimer(dailyCaseText);
      setWeeklyCaseTimer(weeklyCaseText);
    };
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Обычные бонусы
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

  // Кейс-бонусы
  const handleCaseReward = (type: "daily" | "weekly", coins: number) => {
    const current = Number(localStorage.getItem(COINS_KEY) || 0);
    localStorage.setItem(COINS_KEY, String(current + coins));
    if (type === "daily") {
      localStorage.setItem(DAILY_CASE_KEY, String(Date.now()));
      setDailyCaseReady(false);
    } else {
      localStorage.setItem(WEEKLY_CASE_KEY, String(Date.now()));
      setWeeklyCaseReady(false);
    }
    setCaseReward(coins);
    setTimeout(() => {
      setShowCase(null);
      setCaseReward(null);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalBackground
        {...(!isAndroid && { initial: { opacity: 0 }, exit: { opacity: 0 } })}
        animate={{ opacity: 1 }}
        transition={{ duration: isAndroid ? 0 : 0.2 }}
        onClick={onClose}
      >
        <ModalContainer
          {...(!isAndroid && { initial: { scale: 0.9 }, exit: { scale: 0.9 } })}
          animate={{ scale: 1 }}
          transition={{ duration: isAndroid ? 0 : 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseBtn onClick={() => { if (typeof window.playClick2 === 'function') window.playClick2(); onClose(); }} title="Закрыть">
            ×
          </CloseBtn>
          <Title>Бонус</Title>
          <BonusScrollArea>
            <BonusBlocksRow>
              <BonusBlock>
                <CoinIcon />
                <BonusLabel>Ежедневный бонус</BonusLabel>
                <TimerText>{dailyTimer}</TimerText>
                <BonusButton disabled={!dailyReady} onClick={handleDailyBonus}>
                  Получить +10
                </BonusButton>
              </BonusBlock>
              <BonusBlock>
                <CoinIcon />
                <BonusLabel>Еженедельный бонус</BonusLabel>
                <TimerText>{weeklyTimer}</TimerText>
                <BonusButton
                  disabled={!weeklyReady}
                  onClick={handleWeeklyBonus}
                >
                  Получить +50
                </BonusButton>
              </BonusBlock>
            </BonusBlocksRow>
            <BonusBlocksRow style={{ flexDirection: "column", gap: 12 }}>
              <BonusBlock>
                <FaBoxOpen
                  style={{ color: "#ff9800", fontSize: "2em", marginBottom: 2 }}
                />
                <BonusLabel>Ежедневный кейс</BonusLabel>
                <TimerText>{dailyCaseTimer}</TimerText>
                <BonusButton
                  disabled={!dailyCaseReady}
                  onClick={() => setShowCase("daily")}
                >
                  Открыть кейс
                </BonusButton>
              </BonusBlock>
              <BonusBlock>
                <FaBoxOpen
                  style={{ color: "#ff9800", fontSize: "2em", marginBottom: 2 }}
                />
                <BonusLabel>Еженедельный кейс</BonusLabel>
                <TimerText>{weeklyCaseTimer}</TimerText>
                <BonusButton
                  disabled={!weeklyCaseReady}
                  onClick={() => setShowCase("weekly")}
                >
                  Открыть кейс
                </BonusButton>
              </BonusBlock>
            </BonusBlocksRow>
          </BonusScrollArea>
          {caseReward && (
            <div
              style={{
                textAlign: "center",
                color: "#ff9800",
                fontWeight: 700,
                marginTop: 10,
              }}
            >
              +{caseReward} монет!
            </div>
          )}
        </ModalContainer>
      </ModalBackground>
      {showCase && (
        <CaseRouletteModal
          type={showCase}
          onClose={() => {
            setShowCase(null);
            setCaseReward(null);
          }}
          onReward={(coins) => handleCaseReward(showCase, coins)}
        />
      )}
    </>
  );
};

export default ProgressModal;
