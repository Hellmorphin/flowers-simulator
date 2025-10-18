import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";
import gorshokImg from "../assets/gorshok.jpg";

export type DinoGameProps = {
  onClose: () => void;
  onWin: (coins: number) => void;
  onLose?: () => void;
};

type Obstacle = {
  x: number;
  width: number;
  height: number;
  y: number;
};

type GameState = {
  ctx: CanvasRenderingContext2D | null;
  dinoX: number;
  dinoY: number;
  velocityY: number;
  obstacles: Obstacle[];
  speed: number;
  distance: number;
  score: number;
  isRunning: boolean;
  timeUntilNextObstacle: number;
  timeSinceSpeedIncrease: number;
  lastTimestamp: number;
  lastScorePublish: number;
  clouds?: any[];
};

type Metrics = {
  canvasWidth: number;
  canvasHeight: number;
  groundHeight: number;
  playerWidth: number;
  playerHeight: number;
  obstacleWidthMin: number;
  obstacleWidthRange: number;
  obstacleHeightMin: number;
  obstacleHeightRange: number;
  initialSpeed: number;
  gravity: number;
  jumpVelocity: number;
  scoreScale: number;
  rewardDivisor: number;
};

const BASE_CANVAS_WIDTH = 1280;
const BASE_CANVAS_HEIGHT = 720;
const BASE_GROUND_HEIGHT = 200;
const BASE_PLAYER_WIDTH = 64;
const BASE_PLAYER_HEIGHT = 64;
const BASE_OBSTACLE_WIDTH_MIN = 32;
const BASE_OBSTACLE_WIDTH_RANGE = 36;
const BASE_OBSTACLE_HEIGHT_MIN = 38;
const BASE_OBSTACLE_HEIGHT_RANGE = 30;
const BASE_INITIAL_SPEED = 320;
const BASE_GRAVITY = 2600;
const BASE_JUMP_VELOCITY = -880;
const BASE_SCORE_SCALE = 4;
const BASE_REWARD_DIVISOR = 140;

const SPEED_GAIN_PER_SECOND = 1.01;
const SCORE_UPDATE_INTERVAL = 120;
const SPAWN_GAP_MIN = 0.85;
const SPAWN_GAP_MAX = 1.45;
const MIN_REWARD = 5;

const computeMetrics = (width: number, height: number): Metrics => {
  const widthScale = width / BASE_CANVAS_WIDTH;
  const aspectFix = Math.max(1, (height / width) * 1.5);
  const heightScale = height / BASE_CANVAS_HEIGHT;
  return {
    canvasWidth: width,
    canvasHeight: height,
    groundHeight: BASE_GROUND_HEIGHT * heightScale,
    playerWidth: BASE_PLAYER_WIDTH * widthScale * aspectFix,
    playerHeight: BASE_PLAYER_HEIGHT * heightScale,
    obstacleWidthMin: BASE_OBSTACLE_WIDTH_MIN * widthScale * aspectFix,
    obstacleWidthRange: BASE_OBSTACLE_WIDTH_RANGE * widthScale * aspectFix,
    obstacleHeightMin: BASE_OBSTACLE_HEIGHT_MIN * heightScale,
    obstacleHeightRange: BASE_OBSTACLE_HEIGHT_RANGE * heightScale,
    initialSpeed: BASE_INITIAL_SPEED * widthScale * aspectFix,
    gravity: BASE_GRAVITY * heightScale,
    jumpVelocity: BASE_JUMP_VELOCITY * heightScale,
    scoreScale: Math.max(2, BASE_SCORE_SCALE * widthScale),
    rewardDivisor: Math.max(25, BASE_REWARD_DIVISOR * widthScale * aspectFix),
  };
};

const canvasPalette = {
  sky: "#faf5e6",
  ground: "#9f5a15",
  groundDark: "#834a11",
  groundLine: "#c2a878",
  obstacle: "#2e7d32",
  obstacleShadow: "#1b5e20",
  cloud: "rgba(0,0,0,0.12)",
};

const GameWrapper = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #6d4c2c;
  z-index: 9999;
  touch-action: none;
  user-select: none;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledCanvas = styled.canvas`
  display: block;
  background: #faf5e6;
  border-radius: 8px;
  box-shadow: 0 0 40px #00000022;
`;

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
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  left: 24px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 2.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  transition: transform 0.15s ease, color 0.15s ease;
  z-index: 10;
  &:hover {
    transform: scale(1.05);
    color: #ffffff;
  }
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
  position: absolute;
  inset: 0;
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

function createObstacle(metrics: Metrics): Obstacle {
  const width =
    metrics.obstacleWidthMin + Math.random() * metrics.obstacleWidthRange;
  const height =
    metrics.obstacleHeightMin + Math.random() * metrics.obstacleHeightRange;
  const y = metrics.canvasHeight - metrics.groundHeight - height;
  return {
    x: metrics.canvasWidth + width,
    width,
    height,
    y,
  };
}

function calculateReward(score: number, rewardDivisor: number) {
  const divisor = Math.max(1, rewardDivisor);
  const coins = Math.floor(score / divisor);
  return Math.max(MIN_REWARD, coins);
}

function generateClouds(
  canvasWidth: number,
  canvasHeight: number,
  count: number = 6
) {
  const clouds = [];

  for (let i = 0; i < count; i++) {
    clouds.push({
      // Случайная позиция по X (по всей ширине экрана)
      x: Math.random() * canvasWidth,

      // Высота — примерно верхняя треть экрана
      y: 20 + Math.random() * (canvasHeight * 0.3),

      // Размер — от 15 до 30 пикселей
      radius: 15 + Math.random() * 15,

      // Прозрачность — от 0.5 до 1.0 (для глубины)
      opacity: 0.5 + Math.random() * 0.5,
    });
  }

  return clouds;
}

function drawScene(
  state: GameState,
  metrics: Metrics,
  playerImage: HTMLImageElement | null,
  imageLoaded: boolean
) {
  const ctx = state.ctx;
  if (!ctx) return;

  ctx.clearRect(0, 0, metrics.canvasWidth, metrics.canvasHeight);
  ctx.fillStyle = canvasPalette.sky;
  ctx.fillRect(0, 0, metrics.canvasWidth, metrics.canvasHeight);

  ctx.fillStyle = canvasPalette.cloud;

  ctx.fillStyle = canvasPalette.cloud;
  state.clouds.forEach((cloud) => {
    ctx.globalAlpha = cloud.opacity;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = canvasPalette.ground;
  ctx.fillRect(
    0,
    metrics.canvasHeight - metrics.groundHeight,
    metrics.canvasWidth,
    metrics.groundHeight
  );

  ctx.fillStyle = canvasPalette.groundDark;
  ctx.fillRect(
    0,
    metrics.canvasHeight - metrics.groundHeight / 1.2,
    metrics.canvasWidth,
    metrics.groundHeight
  );

  ctx.strokeStyle = canvasPalette.groundLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, metrics.canvasHeight - metrics.groundHeight + 0.5);
  ctx.lineTo(
    metrics.canvasWidth,
    metrics.canvasHeight - metrics.groundHeight + 0.5
  );
  ctx.stroke();

  state.obstacles.forEach((obstacle) => {
    ctx.fillStyle = canvasPalette.obstacle;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = canvasPalette.obstacleShadow;
    ctx.fillRect(
      obstacle.x + obstacle.width * 0.2,
      obstacle.y,
      obstacle.width * 0.25,
      obstacle.height
    );
  });

  if (imageLoaded && playerImage) {
    ctx.drawImage(
      playerImage,
      state.dinoX,
      state.dinoY,
      metrics.playerWidth,
      metrics.playerHeight
    );
  } else {
    ctx.fillStyle = "#424242";
    ctx.fillRect(
      state.dinoX,
      state.dinoY,
      metrics.playerWidth,
      metrics.playerHeight
    );
  }
}

export function DinoGame({ onClose, onWin, onLose }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const imageReadyRef = useRef(false);
  const mountedRef = useRef(true);

  const initialWidth =
    typeof window !== "undefined" ? window.innerWidth : BASE_CANVAS_WIDTH;
  const initialHeight =
    typeof window !== "undefined" ? window.innerHeight : BASE_CANVAS_HEIGHT;

  const metricsRef = useRef<Metrics>(
    computeMetrics(initialWidth, initialHeight)
  );

  const stateRef = useRef<GameState>({
    ctx: null,
    dinoX: metricsRef.current.canvasWidth * 0.08,
    dinoY:
      metricsRef.current.canvasHeight -
      metricsRef.current.groundHeight -
      metricsRef.current.playerHeight,
    velocityY: 0,
    obstacles: [],
    speed: metricsRef.current.initialSpeed,
    distance: 0,
    score: 0,
    isRunning: false,
    timeUntilNextObstacle: SPAWN_GAP_MIN,
    timeSinceSpeedIncrease: 0,
    lastTimestamp: 0,
    lastScorePublish: 0,
    clouds: generateClouds(
      metricsRef.current.canvasWidth,
      metricsRef.current.canvasHeight,
      8
    ),
  });

  const [status, setStatus] = useState<"countdown" | "running" | "gameover">(
    "countdown"
  );
  const [displayScore, setDisplayScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [reward, setReward] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(3);

  const resetGameState = useCallback((metrics: Metrics) => {
    const state = stateRef.current;
    state.dinoX = metrics.canvasWidth * 0.08;
    state.dinoY =
      metrics.canvasHeight - metrics.groundHeight - metrics.playerHeight;
    state.velocityY = 0;
    state.obstacles = [];
    state.speed = metrics.initialSpeed;
    state.distance = 0;
    state.score = 0;
    state.isRunning = false;
    state.timeUntilNextObstacle = SPAWN_GAP_MIN;
    state.timeSinceSpeedIncrease = 0;
    state.lastTimestamp = 0;
    state.lastScorePublish = 0;
  }, []);

  const syncCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const viewWidth =
      typeof window !== "undefined" ? window.innerWidth : BASE_CANVAS_WIDTH;
    const viewHeight =
      typeof window !== "undefined" ? window.innerHeight : BASE_CANVAS_HEIGHT;

    const metrics = computeMetrics(viewWidth, viewHeight);
    metricsRef.current = metrics;

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.round(viewWidth * dpr);
    canvas.height = Math.round(viewHeight * dpr);
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stateRef.current.ctx = ctx;
    resetGameState(metrics);
    setDisplayScore(0);
    setStatus("countdown");
    setCountdown(3);
    drawScene(
      stateRef.current,
      metrics,
      playerImageRef.current,
      imageReadyRef.current
    );
  }, [resetGameState]);

  useEffect(() => {
    mountedRef.current = true;
    syncCanvas();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", syncCanvas);
    }
    return () => {
      mountedRef.current = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", syncCanvas);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [syncCanvas]);

  useEffect(() => {
    const image = new Image();
    image.src = gorshokImg;
    const handleLoad = () => {
      playerImageRef.current = image;
      imageReadyRef.current = true;
      drawScene(stateRef.current, metricsRef.current, image, true);
    };
    image.addEventListener("load", handleLoad);
    if (image.complete) {
      handleLoad();
    }
    return () => image.removeEventListener("load", handleLoad);
  }, []);

  const publishScore = useCallback((score: number, now: number) => {
    const state = stateRef.current;
    if (now - state.lastScorePublish >= SCORE_UPDATE_INTERVAL) {
      state.lastScorePublish = now;
      setDisplayScore(score);
    }
  }, []);

  const endGame = useCallback(() => {
    const metrics = metricsRef.current;
    const state = stateRef.current;
    state.isRunning = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const score = state.score;
    const coins = calculateReward(score, metrics.rewardDivisor);
    if (!mountedRef.current) return;
    setLastScore(score);
    setReward(coins);
    setStatus("gameover");
  }, []);

  const loop = useCallback(
    (timestamp: number) => {
      const state = stateRef.current;
      if (!state.isRunning) return;

      const metrics = metricsRef.current;

      if (!state.lastTimestamp) {
        state.lastTimestamp = timestamp;
        state.lastScorePublish = timestamp;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const deltaMs = timestamp - state.lastTimestamp;
      const delta = Math.min(0.05, deltaMs / 1000);
      state.lastTimestamp = timestamp;

      state.timeUntilNextObstacle -= delta;
      state.timeSinceSpeedIncrease += delta;

      state.velocityY += metrics.gravity * delta;
      state.dinoY += state.velocityY * delta;

      const groundY =
        metrics.canvasHeight - metrics.groundHeight - metrics.playerHeight;
      if (state.dinoY >= groundY) {
        state.dinoY = groundY;
        state.velocityY = 0;
      }

      state.obstacles = state.obstacles
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - state.speed * delta,
        }))
        .filter(
          (obstacle) => obstacle.x + obstacle.width > -metrics.playerWidth
        );

      if (state.timeUntilNextObstacle <= 0) {
        if (
          state.obstacles.length === 0 ||
          state.obstacles[state.obstacles.length - 1].x <
            metrics.canvasWidth - metrics.playerWidth * 4
        ) {
          state.obstacles.push(createObstacle(metrics));
          const gap =
            (Math.random() * (SPAWN_GAP_MAX - SPAWN_GAP_MIN) + SPAWN_GAP_MIN) *
            (metrics.initialSpeed / Math.max(1, state.speed));
          state.timeUntilNextObstacle = gap;
        } else {
          state.timeUntilNextObstacle = 0.25;
        }
      }

      if (state.timeSinceSpeedIncrease >= 1) {
        const increments = Math.floor(state.timeSinceSpeedIncrease);
        state.speed *= SPEED_GAIN_PER_SECOND ** increments;
        state.timeSinceSpeedIncrease -= increments;
      }

      state.distance += state.speed * delta;
      state.score = Math.floor(state.distance / metrics.scoreScale);
      publishScore(state.score, timestamp);

      const dinoTop = state.dinoY;
      const dinoBottom = state.dinoY + metrics.playerHeight;
      const dinoLeft = state.dinoX;
      const dinoRight = state.dinoX + metrics.playerWidth;

      const collided = state.obstacles.some((obstacle) => {
        const obsLeft = obstacle.x;
        const obsRight = obstacle.x + obstacle.width;
        const obsTop = obstacle.y;
        const obsBottom = obstacle.y + obstacle.height;
        return (
          dinoLeft < obsRight &&
          dinoRight > obsLeft &&
          dinoTop < obsBottom &&
          dinoBottom > obsTop
        );
      });

      drawScene(state, metrics, playerImageRef.current, imageReadyRef.current);

      if (collided) {
        endGame();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [endGame, publishScore]
  );

  const startGame = useCallback(() => {
    const metrics = metricsRef.current;
    resetGameState(metrics);
    const state = stateRef.current;
    state.isRunning = true;
    state.lastTimestamp = 0;
    state.lastScorePublish = 0;
    setDisplayScore(0);
    setStatus("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, resetGameState]);

  const restartGame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const metrics = metricsRef.current;
    resetGameState(metrics);
    setReward(0);
    setLastScore(0);
    setDisplayScore(0);
    setCountdown(3);
    setStatus("countdown");
    drawScene(
      stateRef.current,
      metrics,
      playerImageRef.current,
      imageReadyRef.current
    );
  }, [resetGameState]);

  useEffect(() => {
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
      startGame();
    }, 700);
    return () => clearTimeout(timer);
  }, [countdown, startGame]);

  const attemptJump = useCallback(() => {
    if (status !== "running") return;
    const metrics = metricsRef.current;
    const state = stateRef.current;
    const groundY =
      metrics.canvasHeight - metrics.groundHeight - metrics.playerHeight;
    if (Math.abs(state.dinoY - groundY) < 1) {
      state.velocityY = metrics.jumpVelocity;
    }
  }, [status]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-nojump]")) return;
    if (countdown !== null) return;
    if (status === "running") {
      event.preventDefault();
      attemptJump();
      return;
    }
    if (status === "gameover") {
      restartGame();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (countdown !== null) return;
        if (status === "running") {
          attemptJump();
        } else if (status === "gameover") {
          restartGame();
        }
      } else if (event.code === "Escape") {
        event.preventDefault();
        if (status === "running" && onLose) {
          onLose();
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attemptJump, countdown, onClose, onLose, restartGame, status]);

  const handleCollectReward = () => {
    onWin(reward);
    onClose();
  };

  const handleExit = () => {
    if (status === "running" && onLose) {
      onLose();
    }
    onClose();
  };

  return (
    <GameWrapper onPointerDown={handlePointerDown}>
      <CloseButton onClick={handleExit} title="Закрыть" data-nojump>
        &times;
      </CloseButton>
      <CanvasContainer>
        <ScoreBadge>{String(displayScore).padStart(5, "0")}</ScoreBadge>
        <StyledCanvas ref={canvasRef} />
        {countdown !== null && (
          <CountdownScreen>{countdown > 0 ? countdown : "Go!"}</CountdownScreen>
        )}
        {status === "gameover" && (
          <GameOverPanel onPointerDown={(e) => e.stopPropagation()}>
            <GameOverCard data-nojump>
              <GameOverTitle>Заработано</GameOverTitle>
              <div
                style={{ color: "#6d4c41", fontWeight: 600, marginBottom: 6 }}
              >
                Счёт: {lastScore}
              </div>
              <RewardText>Награда</RewardText>
              <RewardValue>
                <FaCoins size={22} /> {reward}
              </RewardValue>
              <ButtonRow>
                <ActionButton onClick={handleCollectReward}>
                  Забрать монеты
                </ActionButton>
              </ButtonRow>
            </GameOverCard>
          </GameOverPanel>
        )}
      </CanvasContainer>
    </GameWrapper>
  );
}
