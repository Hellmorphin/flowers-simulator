import { FaCoins } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import gorshokImg from "../assets/gorshok.jpg";
import bombImg from "../assets/Booml.png";

const GAME_DURATION = 60; // секунд
const OBJECT_FALL_TIME = 1200; // мс // быстрее падение для 60Гц
const OBJECT_SPAWN_INTERVAL = 300; // мс // реже спавн
const BOMB_CHANCE = 0.3; // вероятность появления бомбы

export type FallingObjectsGameProps = {
  onClose: () => void;
  onWin: (coins: number) => void;
};

export function FallingObjectsGame({
  onClose,
  onWin,
}: FallingObjectsGameProps) {
  const [objects, setObjects] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState<null | "lose" | "win">(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  // Функция для максимально отзывчивого клика
  const handleObjectPointerDown = (id: string, isBomb: boolean) => {
    if (gameOver) return;
    // Сразу ловим, даже если палец чуть задел hitbox
    setObjects((objs) => objs.filter((o) => o.id !== id));
    if (isBomb) {
      setGameOver("lose");
      setObjects([]);
      return;
    }

    setScore((s) => s + 1);
  };

  // Отсчёт перед стартом
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

  // Таймер игры
  useEffect(() => {
    if (gameOver || countdown !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameOver("win");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [gameOver, countdown]);

  // Спавн падающих объектов
  useEffect(() => {
    if (gameOver || countdown !== null) return;
    spawnRef.current = setInterval(() => {
      console.log("here");
      setObjects((objs_) => {
        const now = Date.now();
        const objs = objs_.filter((x) => {
          return now - x.born < OBJECT_FALL_TIME;
        });
        const maxObjects = 12;
        if (objs.length >= maxObjects) return objs; // лимит для платформы
        const isBomb = Math.random() < BOMB_CHANCE;
        const screenW = window.innerWidth;
        const objW = 88; // ширина hitbox совпадает с ObjectImg
        const padding = screenW < 600 ? 16 : 0;
        // x всегда в пределах экрана с учетом padding
        const x =
          Math.random() * Math.max(0, screenW - objW - 2 * padding) + padding;
        // Гарантируем, что горшок не выйдет за пределы экрана
        const safeX = Math.max(padding, Math.min(x, screenW - objW - padding));

        const newObjs = [
          ...objs,
          {
            id: Math.random().toString(36).slice(2),
            x: safeX,
            y: -120,
            isBomb,
            born: now,
          },
        ];
        return newObjs;
      });
    }, OBJECT_SPAWN_INTERVAL);
    return () => clearInterval(spawnRef.current!);
  }, [gameOver, countdown]);

  // Движение объектов вниз через time delta (плавно на любых экранах)
  /*   useEffect(() => {
    if (gameOver) return;
    let running = true;
    function animate() {
      if (!running) return;
      const screenH = window.innerHeight;
      const now = Date.now();
      console.log("rerender");
      setObjects((objs) => {
        return objs
          .map((obj) => {
            const t = now - (obj.born || now); // ms
            const frac = Math.min(1, t / OBJECT_FALL_TIME); // 0..1
            return {
              ...obj,
              y: screenH * frac,
            };
          })
          .filter(
            (obj) =>
              obj.y < screenH + 40 &&
              now - (obj.born || 0) < OBJECT_FALL_TIME + 500
          );
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => {
      running = false;
    };
  }, [gameOver]); */

  // Формат времени
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Модалки (проигрыш/выигрыш)
  // При завершении игры (win/lose) — очищаем объекты
  React.useEffect(() => {
    if (gameOver === "win" || gameOver === "lose") {
      setObjects([]);
    }
  }, [gameOver]);

  let modal = null;
  if (gameOver === "lose") {
    modal = (
      <ModalBox>
        <ModalTitle>Вы проиграли!</ModalTitle>
        <ModalButton onClick={onClose}>Закрыть</ModalButton>
      </ModalBox>
    );
  } else if (gameOver === "win") {
    modal = (
      <ModalBox>
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
        <div style={{ fontSize: "2.2rem", color: "#ffb300", marginBottom: 8 }}>
          <FaCoins size={22} style={{ marginRight: 6 }} /> {score * 2}
        </div>
        <ModalButton
          onClick={() => {
            onWin(score * 2);
          }}
        >
          Забрать
        </ModalButton>
      </ModalBox>
    );
  }

  // Модальное окно поверх всего (как MiniGame)
  return (
    <GameWrapper ref={gameRef}>
      {countdown !== null ? (
        <CountdownScreen>{countdown > 0 ? countdown : "Go!"}</CountdownScreen>
      ) : (
        <>
          <TimerBar>{formatTime(timeLeft)}</TimerBar>
          {objects.map((obj) => {
            const screenW = window.innerWidth;
            const objW = 68;
            const padding = screenW < 600 ? 16 : 0;
            // left строго в пределах экрана
            const left = Math.max(
              padding,
              Math.min(obj.x, screenW - objW - padding)
            );
            return (
              <ObjectImg
                key={obj.id}
                src={obj.isBomb ? bombImg : gorshokImg}
                alt={obj.isBomb ? "Бомба" : "Горшок"}
                onPointerDown={() =>
                  handleObjectPointerDown(obj.id, obj.isBomb)
                }
                onTouchStart={() => handleObjectPointerDown(obj.id, obj.isBomb)}
                onClick={() => handleObjectPointerDown(obj.id, obj.isBomb)}
                onMouseDown={() => handleObjectPointerDown(obj.id, obj.isBomb)}
                onMouseUp={() => handleObjectPointerDown(obj.id, obj.isBomb)}
                style={{
                  top: 0,
                  transform: `translateY(${obj.y}px)`,
                  left,
                  filter: "",
                  position: "absolute",
                  pointerEvents: "all",
                  touchAction: "manipulation",
                  padding,
                  zIndex: 1, // ниже модалок
                }}
              />
            );
          })}
          {modal}
        </>
      )}
    </GameWrapper>
  );
}

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

const GameWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #6d4c2c;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
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

const fallingDown = keyframes`
  from {
    transform: translateY(-120);
  }
  to {
    transform: translateY(100vh);
  }
`;

const ObjectImg = styled.img`
  position: absolute;
  width: 88px;
  height: 88px;
  cursor: pointer;
  user-select: none;
  transition: filter 0.1s;
  z-index: 1; /* ниже модалок */
  touch-action: manipulation;
  will-change: transform;
  /* увеличенный hitbox */
  animation: ${fallingDown} ${OBJECT_FALL_TIME}ms linear;
`;

const ModalBox = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 18px;
  box-shadow: 0 12px 40px #6d4c4133;
  min-width: 260px;
  max-width: 90vw;
  padding: 32px 24px;
  text-align: center;
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
