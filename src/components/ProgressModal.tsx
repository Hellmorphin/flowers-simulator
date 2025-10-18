import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import CaseRouletteModal from "./CaseRouletteModal";
import { motion } from "framer-motion";

// --- Промокоды ---
const PROMO_LIST = [
  { code: "4JKF9-PT7LQ-Z8XRC-DM2VY", reward: 300 },
  { code: "N9T4E-Q7RWA-3LZ8J-KCX5B", reward: 500 },
  { code: "L2VQ9-MX4JP-T8ZWR-NK5YG", reward: 1000 },
  { code: "D7K8E-ZL3RQ-H2VNY-P9XMC", reward: 2000 },
  { code: "DDVQ9-GGHT4-GVDCE-N111F", reward: 1000 },
  { code: "3RRRE-QFVDA-3888J-K345B", reward: 500 },
  { code: "KKK4E-QFCDW-38Z8J-KCERB", reward: 500 },
  { code: "K254E-Q25DW-25252-K25RB", reward: 20000 },
];

function PromoCodeField() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<null | "ok" | "used" | "fail">(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const handleApply = () => {
    setStatus(null);
    setLoading(true);
    setTimeout(() => {
      const code = value.trim().toUpperCase();
      const promo = PROMO_LIST.find((p) => p.code === code);
      if (!promo) {
        setStatus("fail");
        setLoading(false);
        return;
      }
      const used = JSON.parse(localStorage.getItem("flowersim.promos") || "[]");
      if (used.includes(code)) {
        setStatus("used");
        setLoading(false);
        return;
      }
      // Дать монеты
      const current = Number(localStorage.getItem("progress_coins") || 0);
      localStorage.setItem("progress_coins", String(current + promo.reward));
      localStorage.setItem("flowersim.promos", JSON.stringify([...used, code]));
      setStatus("ok");
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        margin: "12px 0 0 0",
        padding: "18px 12px 18px 12px",
        background: "rgba(255, 236, 179, 0.98)",
        borderRadius: 16,
        boxShadow: "0 2px 8px #a1887f44",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#ff9800",
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        Ключ
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus(null);
        }}
        placeholder="Активация ключа"
        style={{
          border: "2px solid #ffb300",
          borderRadius: 10,
          padding: "10px 10px",
          fontSize: 18,
          width: 200,
          outline: "none",
          marginBottom: 4,
          background: "#fff",
          color: "#6d4c41",
          boxShadow: "0 1px 4px #ffb30022",
          textAlign: "center",
          letterSpacing: 1,
        }}
        disabled={loading}
        maxLength={32}
        autoComplete="off"
      />
      <button
        onClick={handleApply}
        disabled={loading || !value.trim()}
        style={{
          background: "#ffb300",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 24px",
          fontWeight: 700,
          fontSize: 17,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 4,
          boxShadow: "0 2px 8px #ffb30033",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Проверка..." : "Активировать"}
      </button>
      {status === "ok" && (
        <div style={{ color: "#43a047", fontWeight: 700, fontSize: 16 }}>
          Ключ активирован!
        </div>
      )}
      {status === "fail" && (
        <div style={{ color: "#d32f2f", fontWeight: 700, fontSize: 16 }}>
          Ключ не верный!
        </div>
      )}
      {status === "used" && (
        <div style={{ color: "#d32f2f", fontWeight: 700, fontSize: 16 }}>
          Ключ уже активирован!
        </div>
      )}
    </div>
  );
}

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
  box-shadow: 0 2px 8px #a1887f44;
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
  box-shadow: 0 2px 8px #a1887f44;
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
  // cooldown после открытия кейса
  const [caseCooldown, setCaseCooldown] = useState(false);

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
    setCaseCooldown(true);
    setTimeout(() => {
      setShowCase(null);
      setCaseReward(null);
      // Ставим cooldown на 3 секунды после закрытия кейса
      setTimeout(() => setCaseCooldown(false), 3000);
    }, 1200);
  };

  if (!isOpen) return null;

  // Обёртка для onClose: если открыт кейс, сначала закрыть его
  const handleModalClose = () => {
    if (showCase) {
      setShowCase(null);
      setCaseReward(null);
    } else {
      onClose();
    }
  };

  return (
    <>
      <ModalBackground
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        onClick={handleModalClose}
      >
        <ModalContainer
          initial={false}
          animate={{ scale: 1 }}
          transition={{ duration: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseBtn
            onClick={() => {
              if (typeof window.playClick2 === "function") window.playClick2();
              handleModalClose();
            }}
            title="Закрыть"
          >
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
                  disabled={
                    !dailyCaseReady || showCase !== null || caseCooldown
                  }
                  onClick={() => {
                    if (!showCase && !caseCooldown) setShowCase("daily");
                  }}
                >
                  {caseCooldown ? "Подождите..." : "Открыть кейс"}
                </BonusButton>
              </BonusBlock>
              <BonusBlock>
                <FaBoxOpen
                  style={{ color: "#ff9800", fontSize: "2em", marginBottom: 2 }}
                />
                <BonusLabel>Еженедельный кейс</BonusLabel>
                <TimerText>{weeklyCaseTimer}</TimerText>
                <BonusButton
                  disabled={
                    !weeklyCaseReady || showCase !== null || caseCooldown
                  }
                  onClick={() => {
                    if (!showCase && !caseCooldown) setShowCase("weekly");
                  }}
                >
                  {caseCooldown ? "Подождите..." : "Открыть кейс"}
                </BonusButton>
              </BonusBlock>
            </BonusBlocksRow>
            <PromoCodeField />
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
