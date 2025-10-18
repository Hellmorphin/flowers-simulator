import React, { useRef, useEffect, useState } from "react";
import FlappyScoreBadge from "./FlappyScoreBadge";

// Путь к картинке gorshock.jpg
import gorshokImg from "../assets/gorshok.jpg";

interface FlappyBirdGameProps {
  onGameOver: (score: number) => void;
  gameStarted: boolean;
}

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const BASE_GRAVITY = 2600;
const BASE_FLAP = -650;
const GRAVITY = BASE_GRAVITY * (GAME_HEIGHT / 720);
const FLAP = BASE_FLAP * (GAME_HEIGHT / 720);
const PIPE_WIDTH = 60;
const PIPE_GAP = 173;
const PIPE_INTERVAL = 1800;
const BIRD_SIZE = 48;

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({
  onGameOver,
  gameStarted,
}) => {
  const lastTouchRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Игровые переменные
  const birdY = useRef(GAME_HEIGHT / 2);
  const birdV = useRef(0);
  const pipes = useRef<{ x: number; gapY: number; isGold?: boolean }[]>([]);
  const totalPipesCreated = useRef(0);
  const PIPE_DISTANCE = 320; // фиксированное расстояние между трубами

  // Основной игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    let animationFrame: number;
    const ctx = canvasRef.current?.getContext("2d");
    const birdImg = new window.Image();
    birdImg.src = gorshokImg;

    let lastTime = performance.now();

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // Фон
      ctx.fillStyle = "#87ceeb";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // Птица (gorshock)
      ctx.drawImage(
        birdImg,
        GAME_WIDTH / 4 - BIRD_SIZE / 2,
        birdY.current,
        BIRD_SIZE,
        BIRD_SIZE
      );
      // Трубы
      ctx.fillStyle = "#228B22";
      pipes.current.forEach((pipe) => {
        // Золотая труба по флагу
        const pipeColor = pipe.isGold ? "#FFD700" : "#228B22";
        const tipColor = pipe.isGold ? "#FFF8DC" : "#AEEA00";
        const borderColor = pipe.isGold ? "#B8860B" : "#333";

        // Верхняя труба
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        // Верхний наконечник
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.fillStyle = tipColor;
        ctx.beginPath();
        ctx.rect(pipe.x - 2, pipe.gapY - 22, PIPE_WIDTH + 4, 22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeRect(pipe.x - 2, pipe.gapY - 22, PIPE_WIDTH + 4, 22);

        // Нижняя труба
        ctx.fillStyle = pipeColor;
        ctx.fillRect(
          pipe.x,
          pipe.gapY + PIPE_GAP,
          PIPE_WIDTH,
          window.innerHeight - pipe.gapY - PIPE_GAP
        );
        // Нижний наконечник
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.fillStyle = tipColor;
        ctx.beginPath();
        ctx.rect(pipe.x - 2, pipe.gapY + PIPE_GAP, PIPE_WIDTH + 4, 22);
        ctx.closePath();
        ctx.fill();
        ctx.strokeRect(pipe.x - 2, pipe.gapY + PIPE_GAP, PIPE_WIDTH + 4, 22);
      });
      // Счёт теперь рисуется отдельным компонентом поверх canvas
    }

    function update(dt: number) {
      // dt — миллисекунды, переводим в секунды
      const dtSec = dt / 1000;
      // Птица
      birdV.current += GRAVITY * dtSec;
      birdY.current += birdV.current * dtSec;
      // Трубы
      pipes.current.forEach((pipe) => (pipe.x -= 180 * dtSec)); // скорость труб выше
      // Удаление труб
      if (pipes.current.length && pipes.current[0].x < -PIPE_WIDTH) {
        // Проверка на золотую трубу по флагу
        const pipe = pipes.current[0];
        pipes.current.shift();
        setScore((s) => s + (pipe.isGold ? 30 : 5));
      }
      // Добавление труб с фиксированным расстоянием
      if (pipes.current.length === 0) {
        // Первая труба появляется дальше
        const gapY =
          Math.floor(Math.random() * (window.innerHeight - PIPE_GAP - 80)) + 40;
        totalPipesCreated.current += 1;
        pipes.current.push({
          x: GAME_WIDTH + 200,
          gapY,
          isGold: totalPipesCreated.current % 20 === 0,
        });
      } else {
        const lastPipe = pipes.current[pipes.current.length - 1];
        if (lastPipe.x < GAME_WIDTH - PIPE_DISTANCE) {
          const gapY =
            Math.floor(Math.random() * (window.innerHeight - PIPE_GAP - 80)) +
            40;
          totalPipesCreated.current += 1;
          pipes.current.push({
            x: GAME_WIDTH,
            gapY,
            isGold: totalPipesCreated.current % 20 === 0,
          });
        }
      }
      // Столкновения
      const birdRect = {
        x: GAME_WIDTH / 4 - BIRD_SIZE / 2,
        y: birdY.current,
        w: BIRD_SIZE,
        h: BIRD_SIZE,
      };
      for (const pipe of pipes.current) {
        if (
          birdRect.x + birdRect.w > pipe.x &&
          birdRect.x < pipe.x + PIPE_WIDTH &&
          (birdRect.y < pipe.gapY ||
            birdRect.y + birdRect.h > pipe.gapY + PIPE_GAP)
        ) {
          setGameOver(true);
          onGameOver(score);
          return;
        }
      }
      // Падение вниз/вверх
      if (birdY.current < 0 || birdY.current + BIRD_SIZE > window.innerHeight) {
        setGameOver(true);
        onGameOver(score);
        return;
      }
    }

    function loop(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      update(dt);
      draw();
      if (!gameOver) animationFrame = requestAnimationFrame(loop);
    }
    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameStarted, gameOver, score, onGameOver]);

  // Кнопка прыжка
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const handler = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.code === "Space") birdV.current = FLAP;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameStarted, gameOver]);

  // Клик по Canvas и touch для мобильных
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) return;
    // Если был touchstart в последние 300мс — игнорируем click
    if (Date.now() - lastTouchRef.current < 300) return;
    birdV.current = FLAP;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouch = (e: TouchEvent) => {
      if (!gameStarted || gameOver) return;
      lastTouchRef.current = Date.now();
      birdV.current = FLAP;
    };
    canvas.addEventListener("touchstart", handleTouch);
    return () => {
      canvas.removeEventListener("touchstart", handleTouch);
    };
  }, [gameStarted, gameOver]);

  // Основной Canvas
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <FlappyScoreBadge>{String(score).padStart(5, "0")}</FlappyScoreBadge>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          background: "#87ceeb",
          display: "block",
          border: "none",
        }}
        tabIndex={0}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default FlappyBirdGame;
