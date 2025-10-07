import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBoxOpen, FaCoins } from "react-icons/fa";
import { motion } from "framer-motion";

const ModalBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.35);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)`
  background: #fffde7;
  border-radius: 2rem;
  box-shadow: 0 8px 32px #6d4c4133;
  min-width: 0;
  max-width: 400px;
  min-height: 220px;
  max-height: 90dvh;
  padding: 2rem 2vw 2rem 2vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  text-align: center;
  color: #6d4c41;
  width: 100%;
`;

const ChestIcon = styled(FaBoxOpen)`
  color: #ff9800;
  font-size: 3em;
  margin-bottom: 10px;
`;

const RewardRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 7px;
  margin: 12px 0;
  justify-content: center;
  flex-wrap: wrap;
`;

const RewardItem = styled.div<{ $highlight?: boolean }>`
  background: ${({ $highlight }) => ($highlight ? "#ffe082" : "#fff")};
  border-radius: 10px;
  box-shadow: 0 2px 8px #ffb30033;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  color: #6d4c41;
  font-size: 0.95em;
  min-width: 38px;
  border: ${({ $highlight }) =>
    $highlight ? "2px solid #ffb300" : "2px solid #eee"};
`;

const RewardIcon = styled(FaCoins)`
  color: #ffd700;
  font-size: 1.5em;
  margin-bottom: 2px;
`;

const Button = styled.button`
  background: #ffb300;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  font-size: 1em;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin: 1.2rem 0 0 0;
  width: 100%;
  max-width: 180px;
  transition: background 0.2s;
  display: block;
  &:hover {
    background: #ffa000;
  }
`;

const rewardsDaily = [
  { coins: 200, chance: 0.05 },
  { coins: 50, chance: 0.1 },
  { coins: 40, chance: 0.15 },
  { coins: 30, chance: 0.3 },
  { coins: 20, chance: 0.4 },
];
const rewardsWeekly = [
  { coins: 1000, chance: 0.03 },
  { coins: 500, chance: 0.05 },
  { coins: 400, chance: 0.12 },
  { coins: 300, chance: 0.3 },
  { coins: 200, chance: 0.5 },
];

function getRandomReward(rewards: { coins: number; chance: number }[]) {
  const r = Math.random();
  let acc = 0;
  for (const reward of rewards) {
    acc += reward.chance;
    if (r <= acc) return reward.coins;
  }
  return rewards[rewards.length - 1].coins;
}

export interface CaseRouletteModalProps {
  type: "daily" | "weekly";
  onClose: () => void;
  onReward: (coins: number) => void;
}

const CaseRouletteModal: React.FC<CaseRouletteModalProps> = ({
  type,
  onClose,
  onReward,
}) => {
  const [rolling, setRolling] = useState(true);
  const [resultIdx, setResultIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [showCollect, setShowCollect] = useState(false);
  const rewards = type === "daily" ? rewardsDaily : rewardsWeekly;

  useEffect(() => {
    setRolling(true);
    setResultIdx(null);
    setActiveIdx(0);
    setShowCollect(false);
    const coins = getRandomReward(rewards);
    const winIdx = rewards.findIndex((r) => r.coins === coins);
    let ticks = 0;
    let interval = 38;
    let slowStart = 38;
    let maxTicks = slowStart + 18 + winIdx;
    let timeouts: number[] = [];
    const animate = () => {
      setActiveIdx((prev) => (prev + 1) % rewards.length);
      ticks++;
      if (ticks < slowStart) {
        timeouts.push(window.setTimeout(animate, interval));
      } else if (ticks < maxTicks) {
        timeouts.push(window.setTimeout(animate, interval + Math.floor((ticks - slowStart) * 7)));
      } else {
        setResultIdx(winIdx);
        setActiveIdx(winIdx);
        setRolling(false);
        timeouts.push(window.setTimeout(() => setShowCollect(true), 600));
      }
    };
    timeouts.push(window.setTimeout(animate, interval));
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [type, rewards]);

  const handleCollect = () => {
    if (resultIdx !== null) {
      onReward(rewards[resultIdx].coins);
      onClose();
    }
  };

  return (
    <ModalBackground
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // onClick={onClose} // Отключаем закрытие по клику вне окна
    >
      <ModalContainer
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        // onClick={e => e.stopPropagation()} // Отключаем закрытие по клику вне окна
      >
        <Title>
          {type === "daily" ? "Ежедневный кейс" : "Еженедельный кейс"}
        </Title>
        <ChestIcon />
        <RewardRow>
          {rewards.map((r, idx) => (
            <RewardItem
              key={r.coins}
              $highlight={rolling ? activeIdx === idx : resultIdx === idx}
            >
              <RewardIcon />
              {r.coins}
            </RewardItem>
          ))}
        </RewardRow>
        {rolling && (
          <div style={{ color: "#888", fontWeight: 600, marginTop: 10 }}>
            Открываем кейс...
          </div>
        )}
        {showCollect && resultIdx !== null && (
          <Button onClick={handleCollect}>Забрать награду</Button>
        )}
      </ModalContainer>
    </ModalBackground>
  );
};

export default CaseRouletteModal;
