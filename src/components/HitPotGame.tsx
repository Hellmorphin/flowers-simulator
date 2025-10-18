import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import gorshokImg from "../assets/gorshok.jpg";
import { FaCoins } from "react-icons/fa";

const GAME_DURATION = 60; // секунд
const POT_SHOW_TIME = 900; // мс
const MAX_MISSED = 3;

export const HitPotGame: React.FC<{
  onClose: () => void;
  onWin?: (coins: number) => void;
}> = ({ onClose, onWin }) => {
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [potPos, setPotPos] = useState({ top: 200, left: 200 });
  const [showPot, setShowPot] = useState(false);
  const [potPos2, setPotPos2] = useState<{ top: number; left: number } | null>(
    null
  );
  const [showPot2, setShowPot2] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const potTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameEndedRef = React.useRef(false);

  // 🔸 Отсчёт перед стартом
  const [countdown, setCountdown] = useState<number | null>(3);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0) {
      const t = setTimeout(() => setCountdown(null), 700); // короткая пауза на "Go!"
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    if (gameOver || countdown !== null) return; // ждём конца отсчёта
    setShowPot(false);

    let start = Date.now();
    let lastSec = GAME_DURATION;
    let running = true;

    function tick() {
      if (!running) return;
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const left = Math.max(0, GAME_DURATION - elapsed);
      if (left !== lastSec) {
        setTimeLeft(left);
        lastSec = left;
        if (left <= 0) {
          setGameOver(true);
          setWin(missed < MAX_MISSED);
          setShowPot(false);
          running = false;
          return;
        }
      }
      requestAnimationFrame(tick);
    }

    // Запускаем таймер
    requestAnimationFrame(tick);

    // ⚡ Добавлена пауза 3 секунды перед появлением первого горшка
    const startDelay = setTimeout(() => {
      if (!gameOver && !gameEndedRef.current) spawnPot();
    }, 1500);

    return () => {
      running = false;
      clearTimeout(startDelay);
      clearTimeout(potTimerRef.current!);
    };
  }, [countdown]);
  // игра стартует только после отсчёта

  useEffect(() => {
    if (gameOver) {
      setShowPot(false);
      gameEndedRef.current = true;
      return;
    }
    if (missed >= MAX_MISSED) {
      setGameOver(true);
      setWin(false);
      clearInterval(timerRef.current!);
      clearTimeout(potTimerRef.current!);
      setShowPot(false);
      setShowPot2(false);
      setPotPos2(null);
      gameEndedRef.current = true;
    }
  }, [missed, gameOver]);

  function spawnPot() {
    if (gameOver || gameEndedRef.current) return;
    const potWidth = 80;
    const potHeight = 80;
    const margin = 12;
    const timerHeight = 60;
    const maxTop = window.innerHeight - potHeight - margin;
    const minTop = margin + timerHeight;
    const maxLeft = window.innerWidth - potWidth - margin;
    const minLeft = margin;
    const top1 = Math.random() * (maxTop - minTop) + minTop;
    const left1 = Math.random() * (maxLeft - minLeft) + minLeft;
    setPotPos({ top: top1, left: left1 });
    setShowPot(true);
    if (Math.random() < 0.3) {
      let top2, left2;
      do {
        top2 = Math.random() * (maxTop - minTop) + minTop;
        left2 = Math.random() * (maxLeft - minLeft) + minLeft;
      } while (
        (Math.abs(top2 - top1) < potHeight &&
          Math.abs(left2 - left1) < potWidth) ||
        top2 < minTop
      );
      setPotPos2({ top: top2, left: left2 });
      setShowPot2(true);
      const pot2Timeout = setTimeout(() => {
        if (showPot2) {
          setShowPot2(false);
          setPotPos2(null);
          setMissed((m) => m + 1);
        }
      }, POT_SHOW_TIME);
      (window as any).pot2Timeout = pot2Timeout;
      potTimerRef.current = setTimeout(() => {
        setShowPot(false);
        if (showPot2) {
          setShowPot2(false);
          setPotPos2(null);
          setMissed((m) => m + 2);
        } else {
          setMissed((m) => m + 1);
        }
        setTimeout(() => {
          if (!gameOver && !gameEndedRef.current) spawnPot();
        }, 400);
      }, POT_SHOW_TIME);
    } else {
      setShowPot2(false);
      setPotPos2(null);
      potTimerRef.current = setTimeout(() => {
        setShowPot(false);
        setMissed((m) => m + 1);
        setTimeout(() => {
          if (!gameOver && !gameEndedRef.current) spawnPot();
        }, 400);
      }, POT_SHOW_TIME);
    }
  }

  function handlePotClick() {
    setScore((s) => s + 1);
    setShowPot(false);
    clearTimeout(potTimerRef.current!);
    setTimeout(() => {
      if (!gameOver && !gameEndedRef.current) spawnPot();
    }, 400);
  }

  function handlePot2Click() {
    setScore((s) => s + 1);
    setShowPot2(false);
    setPotPos2(null);
    if ((window as any).pot2Timeout) {
      clearTimeout((window as any).pot2Timeout);
      (window as any).pot2Timeout = null;
    }
  }

  function handleClose() {
    if (win && score > 0) {
      const prev = Number(localStorage.getItem("progress_coins") || 0);
      const earned = score * 2;
      localStorage.setItem("progress_coins", String(prev + earned));
      if (onWin) onWin(earned);
      window.dispatchEvent(
        new CustomEvent("hitpotGameResult", { detail: "win" })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("hitpotGameResult", { detail: "lose" })
      );
      onClose();
    }
  }

  return (
    <GameWrapper>
      {countdown !== null ? (
        <CountdownScreen>{countdown > 0 ? countdown : "Go!"}</CountdownScreen>
      ) : (
        <>
          <TimerBar>{timeLeft} s</TimerBar>
          <MissedBar>Пропущено: {missed}</MissedBar>

          {showPot && (
            <Pot
              src={gorshokImg}
              alt="Горшок"
              style={{ top: potPos.top, left: potPos.left }}
              onClick={handlePotClick}
              onTouchStart={handlePotClick}
              onPointerDown={handlePotClick}
            />
          )}

          {showPot2 && potPos2 && (
            <Pot
              src={gorshokImg}
              alt="Горшок"
              style={{ top: potPos2.top, left: potPos2.left }}
              onClick={handlePot2Click}
              onTouchStart={handlePot2Click}
              onPointerDown={handlePot2Click}
            />
          )}

          {gameOver && (
            <ModalBox>
              {win ? (
                <>
                  <ModalTitle>Заработано</ModalTitle>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 8,
                      gap: 8,
                    }}
                  >
                    <FaCoins size={28} color="#ffb300" />
                    <span
                      style={{
                        color: "#ffb300",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                      }}
                    >
                      {score * 2}
                    </span>
                  </div>
                  <ModalButton onClick={handleClose}>Забрать</ModalButton>
                </>
              ) : (
                <>
                  <ModalTitle>Проигрыш</ModalTitle>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      color: "#6d4c41",
                      marginBottom: 12,
                    }}
                  >
                    Пропущено 3 горшка
                  </div>
                  <ModalButton onClick={handleClose}>Закрыть</ModalButton>
                </>
              )}
            </ModalBox>
          )}
        </>
      )}
    </GameWrapper>
  );
};

const GameWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #6d4c2c;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
`;

const CountdownScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #6d4c2c;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem;
  color: #ffecb3;
  font-weight: bold;
  user-select: none;
`;

const Pot = styled.img`
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: top 0.1s, left 0.1s;
  z-index: 2;
  touch-action: manipulation;
  will-change: transform;
`;

const TimerBar = styled.div`
  position: absolute;
  top: 37px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  z-index: 10;
`;

const MissedBar = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffb300;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 2px;
  background: none;
  border-radius: 0;
  padding: 0;
  z-index: 10;
`;

const ModalBox = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 18px;
  box-shadow: 0 12px 40px #6d4c4133;
  min-width: 260px;
  max-width: 90vw;
  padding: 32px 24px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4000;
`;

const ModalTitle = styled.h2`
  color: #6d4c41;
  font-size: 1.3rem;
  margin: 0 0 1.2rem 0;
  text-align: center;
  width: 100%;
`;

const ModalButton = styled.button`
  background: #ffb300;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 32px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin-top: 18px;
  transition: background 0.2s;
  &:hover:enabled {
    background: #ffa000;
  }
`;
