import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import GorshokImg from "../assets/gorshok.jpg";
import { FaCoins } from "react-icons/fa";

const bgColor = "#6d4c2c";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.18); }
  100% { transform: scale(1); }
`;

const MiniGameWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${bgColor};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Timer = styled.div`
  position: absolute;
  top: 37px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
`;

const gorshokScale = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.18); }
  100% { transform: scale(1); }
`;

const Gorshok = styled.img<{ $animate: boolean }>`
  width: 220px;
  height: 220px;
  object-fit: contain;
  cursor: pointer;
  margin-bottom: 32px;
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${gorshokScale} 0.18s linear;
    `}
`;

const ClikText = styled.div`
  color: #fff;
  font-size: 2.2rem;
  font-weight: bold;
  margin-top: 12px;
  animation: ${pulse} 0.7s infinite;
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 18px;
  padding: 32px 24px;
  text-align: center;
  min-width: 260px;
`;

const Button = styled.button`
  background: #ffb300;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  margin-top: 18px;
  cursor: pointer;
`;

/* === Добавляем экран отсчёта === */
const CountdownScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem;
  color: #ffecb3;
  font-weight: bold;
  z-index: 10001;
  user-select: none;
`;

type MiniGameProps = {
  onClose: () => void;
  onWin: (coins: number) => void;
  onLose?: () => void;
};

export default function MiniGame({ onClose, onWin, onLose }: MiniGameProps) {
  const [coins, setCoins] = useState(0);
  const [timer, setTimer] = useState(15);
  const [finished, setFinished] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3); // ← новое состояние
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // === Логика отсчёта перед стартом ===
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0) {
      const t = setTimeout(() => setCountdown(null), 700);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // === Таймер игры запускаем только после отсчёта ===
  useEffect(() => {
    if (countdown !== null) return; // ждём окончания "3-2-1-Go"
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [countdown]);

  // Проверка на проигрыш
  useEffect(() => {
    if (finished && coins === 0 && onLose) {
      onLose();
    }
  }, [finished, coins, onLose]);

  // === Анимация горшка ===
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerAnim = () => {
    setAnimate(false);
    if (animTimeout.current) clearTimeout(animTimeout.current);
    requestAnimationFrame(() => {
      setAnimate(true);
      animTimeout.current = setTimeout(() => setAnimate(false), 120);
    });
  };

  const handleClick = () => {
    if (!finished && countdown === null) {
      setCoins((c) => c + 1);
      triggerAnim();
    }
  };

  const gorshokRef = useRef<HTMLImageElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!finished && countdown === null) {
      const touches = e.touches ? e.touches.length : 1;
      setCoins((c) => c + touches);
      triggerAnim();
    }
  };

  useEffect(() => {
    const node = gorshokRef.current;
    if (!node) return;
    node.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => {
      node.removeEventListener("touchstart", handleTouchStart);
    };
  }, [finished, countdown]);

  React.useEffect(() => {
    return () => {
      if (animTimeout.current) clearTimeout(animTimeout.current);
    };
  }, []);

  const handleWin = () => {
    onWin(coins);
    onClose();
  };

  // === Рендер ===
  if (countdown !== null) {
    return (
      <CountdownScreen>{countdown > 0 ? countdown : "Go!"}</CountdownScreen>
    );
  }

  return (
    <MiniGameWrapper>
      <Timer>{timer}s</Timer>
      <Gorshok
        ref={gorshokRef}
        src={GorshokImg}
        alt="gorshok"
        onClick={handleClick}
        $animate={animate}
      />
      <ClikText>CLICK!</ClikText>

      {finished && (
        <Modal>
          <ModalContent>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: 12,
                color: "#6d4c41",
              }}
            >
              Заработано:
            </div>
            <div
              style={{ fontSize: "2.2rem", color: "#ffb300", marginBottom: 8 }}
            >
              <FaCoins size={22} style={{ marginRight: 6 }} /> {coins}
            </div>
            <Button onClick={handleWin}>Забрать</Button>
          </ModalContent>
        </Modal>
      )}
    </MiniGameWrapper>
  );
}
