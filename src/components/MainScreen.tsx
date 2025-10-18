import { API_BASE } from "../apiBase.ts";
import React from "react";
// --- Стили для прогресс-бара и кнопки пробуждения ---
const AwakenWrapper = styled.div`
  width: 220px;
  max-width: 90vw;
  border-radius: 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  margin: 32px auto 0 auto;
`;
const AwakenBar = styled.div`
  width: 210px;
  height: 22px;
  background: #ffe082;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px #ffb30022;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AwakenBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: linear-gradient(90deg, #ffd54f 60%, #ffb300 100%);
  border-radius: 12px;
  transition: width 0.3s;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
`;
const AwakenButton = styled.button`
  background: #ffb300;
  color: #fffde7;
  border: none;
  border-radius: 12px;
  padding: 10px 32px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
  &:hover:enabled {
    background: #ffa000;
  }
  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
  @media (max-width: 380px) and (max-height: 670px) {
    font-size: 0.73em;
    padding: 5px 11px;
    border-radius: 8px;
    min-width: 0;
    width: 66%;
    max-width: 150px;
  }
`;
import LeikaImg from "../assets/Leika.png";
import ShuckImg from "../assets/Shuck.png";
import Shuck2Img from "../assets/Shuck2.png";
import { HitPotGame } from "./HitPotGame.tsx";
import FlappyBirdScreen from "./FlappyBirdScreen.tsx";
import YdobrImg from "../assets/Ydobr.png";
import ObrabImg from "../assets/Obrab.png";
import BallImg from "../assets/Ball.png";
import KybImg from "../assets/Kyb.png";
import BYBYImg from "../assets/BYBY.png";
import GusinigaImg from "../assets/Gusiniga.png";
import DragonImg from "../assets/Dragon.png";
import ALImg from "../assets/AL.png";
import gorshokBetaToy from "../assets/gorshokBetaToy1.0.png";
import styled from "styled-components";
import Pot from "./Pot";
import Flower from "./Flower";
import MiniGame from "./MiniGame";
import { FallingObjectsGame } from "./FallingObjectsGame";
import { DinoGame } from "./DinoGame";
import { MiniGameModal } from "./MiniGameModal";
import { FaCoins, FaStore, FaGift, FaImage, FaBolt } from "react-icons/fa";
import { FaTint, FaLeaf, FaSprayCan, FaGamepad } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import bg1 from "../assets/i.jpg";
import bg2 from "../assets/i2.jpg";
import bg3 from "../assets/i3.jpg";
import bg4 from "../assets/i4.jpg";
import bg5 from "../assets/i5.jpg";
import bg6 from "../assets/i6.jpg";
import bg7 from "../assets/i7.jpg";
import bg8 from "../assets/i8.jpg";
import bg9 from "../assets/i9.jpg";
import bg10 from "../assets/i10.jpg";
import bg11 from "../assets/i11.jpg";
import bg12 from "../assets/i12.jpg";
import bg13 from "../assets/i13.png";
import bg14 from "../assets/i14.jpg";
import bg15 from "../assets/i15.jpg";
import bg16 from "../assets/i16.jpg";

import forestBg from "../assets/Forest.jpg";
import loogBg from "../assets/loog.jpg";
import AwakenUpgradeModal from "./AwakenUpgradeModal";
import Click2 from "../assets/Click2.mp3";
import ListImg from "../assets/list.png";
import WoterImg from "../assets/Woter.png";

// --- Меню монеток ---
const CoinBarWrapper = styled.div`
  position: fixed;
  top: 68px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: #222;
  border: 4px solid #ffb300;
  border-radius: 40px;
  padding: 6px 38px 6px 18px;
  display: flex;
  align-items: center;
  min-width: 120px;
  box-shadow: 0 2px 12px #ffb30044;
`;

const P = styled.span``;

const CoinIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 40px;
  font-size: 2rem;
  color: #ffd600;
`;

const CoinAmount = styled.span`
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
`;

const Background = styled.div`
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
`;

const TailIconStyled = styled(motion.button)<{ small?: boolean }>`
  position: relative;
  left: 0;
  width: 60px;
  height: 100px;
  background: linear-gradient(270deg, #ffecb3 60%, #ffb300 100%);
  border-radius: 0 24px 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 8px #a1887f44;
  z-index: 101;
  border: 2px solid #ffb300;
  margin: 0;
  padding: 0;
  outline: none;
  ${({ small }) =>
    small &&
    `
      @media (max-width: 380px) and (max-height: 670px),
             (max-width: 362px) and (max-height: 742px) {
        width: 40px;
        height: 66px;
        border-radius: 0 14px 14px 0;
        & svg {
          width: 22px !important;
          height: 22px !important;
        }
      }
      @media (max-width: 362px) and (max-height: 742px) {
        width: 40px;
        height: 66px;
        border-radius: 0 14px 14px 0;
        & svg {
          width: 22px !important;
          height: 22px !important;
        }
      }
    `}
  // Восстановление картинок для кнопок
// Вставить внутрь TailIconStyled для кнопки "полить"
// {canWater && !disableActions && (
//   <img src={WoterImg} alt="Полить" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 38, height: 38, zIndex: 2, pointerEvents: "none" }} />
// )}
// Вставить внутрь TailIconStyled для кнопки "удобрить"
// {canFertilize && !disableActions && (
//   <img src={ListImg} alt="Удобрить" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 38, height: 38, zIndex: 2, pointerEvents: "none" }} />
// )}

  /* Для 375x667 — мини-игра под кнопкой задания и такого же размера */
  @media (max-width: 380px) and (max-height: 670px) {
    width: 40px;
    height: 66px;
    border-radius: 0 14px 14px 0;
    & svg {
      width: 22px !important;
      height: 22px !important;
    }
  }
`;

const PotWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: calc(50% + 60px);
  transform: translate(-50%, -40%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 700px) {
    left: 50%;
    top: calc(44% + 60px);
    transform: translate(-50%, -40%);
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 2vh;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  color: #fffde7;
  font-size: 1rem;
  opacity: 0.8;
  z-index: 3;
  text-align: center;
  a {
    color: #ffb300;
    text-decoration: underline;
    cursor: pointer;
  }
`;

type MainScreenProps = {
  flowerSize: number;
  flowerVisible: boolean;
  potSkin?: string;
  mainBg?: string | null;
  skin?: string;
  showLeika?: boolean;
  showYdobr?: boolean;
  onPlant: () => void;
  tutorialStep?: number;
  onWater: () => void;
  onFertilize: () => void;
  canWater?: boolean;
  canFertilize?: boolean;
  disableActions?: boolean;
};

const MainScreen: React.FC<MainScreenProps> = ({
  flowerSize,
  flowerVisible,
  potSkin,
  mainBg,
  // showLeika,
  showYdobr,
  onPlant,
  onWater,
  onFertilize,
  canWater,
  canFertilize,
  disableActions,
}) => {
  // --- Анимация лейки при поливе ---
  const [showLeika, setShowLeika] = React.useState(false);
  // --- Анимация обработки ---
  const [showObrab, setShowObrab] = React.useState(false);
  // --- Состояние мини-игры и КД ---
  const [showMiniGame, setShowMiniGame] = React.useState<
    null | "clicker" | "falling" | "hitpot" | "dino" | "flappy"
  >(null);
  const [showMiniGameModal, setShowMiniGameModal] = React.useState(false);
  const MINI_GAME_CLICKER_CD_KEY = "progress_mini_game_clicker_cd";
  const MINI_GAME_FALLING_CD_KEY = "progress_mini_game_falling_cd";
  const MINI_GAME_DINO_CD_KEY = "progress_mini_game_dino_cd";
  const MINI_GAME_CD = 20 * 60 * 1000; // 20 минут
  const [miniGameClickerCooldown, setMiniGameClickerCooldown] = React.useState(
    () => {
      const t = Number(localStorage.getItem(MINI_GAME_CLICKER_CD_KEY) || 0);
      return Math.max(0, t - Date.now());
    }
  );
  const [miniGameFallingCooldown, setMiniGameFallingCooldown] = React.useState(
    () => {
      const t = Number(localStorage.getItem(MINI_GAME_FALLING_CD_KEY) || 0);
      return Math.max(0, t - Date.now());
    }
  );
  const [miniGameDinoCooldown, setMiniGameDinoCooldown] = React.useState(0);
  React.useEffect(() => {
    if (miniGameClickerCooldown <= 0) return;
    const interval = setInterval(() => {
      setMiniGameClickerCooldown((prev) => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [miniGameClickerCooldown]);
  React.useEffect(() => {
    if (miniGameFallingCooldown <= 0) return;
    const interval = setInterval(() => {
      setMiniGameFallingCooldown((prev) => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [miniGameFallingCooldown]);
  React.useEffect(() => {
    if (miniGameDinoCooldown <= 0) return;
    const interval = setInterval(() => {
      setMiniGameDinoCooldown((prev) => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [miniGameDinoCooldown]);
  // Синхронизация с localStorage при смене вкладки
  React.useEffect(() => {
    const handler = () => {
      const t1 = Number(localStorage.getItem(MINI_GAME_CLICKER_CD_KEY) || 0);
      setMiniGameClickerCooldown(Math.max(0, t1 - Date.now()));
      const t2 = Number(localStorage.getItem(MINI_GAME_FALLING_CD_KEY) || 0);
      setMiniGameFallingCooldown(Math.max(0, t2 - Date.now()));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // --- Время последнего входа ---
  // --- Состояние для жука, сохраняем в localStorage ---
  const [beetles, setBeetles] = React.useState<Array<1 | 2>>(() => {
    try {
      const stored = localStorage.getItem("flowersim.beetles");
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.every((v) => v === 1 || v === 2)) {
          return arr;
        }
      }
    } catch {}
    return [];
  });

  React.useEffect(() => {
    const now = Date.now();
    const lastVisit = Number(localStorage.getItem("flowersim.lastVisit") || 0);
    localStorage.setItem("flowersim.lastVisit", String(now));
    // Если цветок видим и жуков меньше двух
    if (flowerVisible && beetles.length < 2) {
      // Считаем сколько жуков должно появиться
      const beetleTimes = [3600000, 7200000]; // 1ч, 2ч
      const elapsed = now - lastVisit;
      let newBeetles = [...beetles];
      beetleTimes.forEach((ms, idx) => {
        if (elapsed >= ms && newBeetles.length <= idx) {
          newBeetles.push(Math.random() > 0.5 ? 1 : 2);
        }
      });
      if (newBeetles.length !== beetles.length) {
        setBeetles(newBeetles.slice(0, 2));
        localStorage.setItem(
          "flowersim.beetles",
          JSON.stringify(newBeetles.slice(0, 2))
        );
      }
    }
  }, [flowerVisible, beetles.length]);
  // Сохраняем жуков при изменении
  React.useEffect(() => {
    try {
      localStorage.setItem("flowersim.beetles", JSON.stringify(beetles));
    } catch {}
  }, [beetles]);
  // --- Воспроизведение звука Click2.mp3 и Click3.mp3 без задержки ---
  const playClick2 = React.useCallback(() => {
    try {
      const audio = new Audio(Click2);
      audio.volume = 0.7;
      // Для устранения пропусков при быстром клике используем cloneNode
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => {});
    } catch (e) {}
  }, []);
  // Экспортируем playClick2 в window для использования в других компонентах (крестики модалок)
  React.useEffect(() => {
    window.playClick2 = playClick2;
    return () => {
      delete window.playClick2;
    };
  }, [playClick2]);
  // Кнопка открытия модалки прокачки пробуждения (вызывается из Menu через проп onAwakenUpgrade)
  // ...
  // Вставьте сюда Menu, если он используется внутри MainScreen, иначе вызовите onAwakenUpgrade из App
  // --- Монеты и уровень прокачки пробуждения ---
  // --- Прокачка пробуждения ---
  const AWAKEN_UPGRADE_KEY = "pot_awaken_upgrade";
  const [upgradeLevel, setUpgradeLevel] = React.useState<number>(() =>
    Number(localStorage.getItem(AWAKEN_UPGRADE_KEY) || 0)
  );
  React.useEffect(() => {
    const handler = () =>
      setUpgradeLevel(Number(localStorage.getItem(AWAKEN_UPGRADE_KEY) || 0));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // --- Модалка прокачки пробуждения ---
  const [showAwakenUpgrade, setShowAwakenUpgrade] = React.useState(false);

  const handleCloseAwakenUpgrade = () => setShowAwakenUpgrade(false);
  const flowerSkin =
    localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
  const [coins, setCoins] = React.useState<number>(
    Number(localStorage.getItem("progress_coins") || 0)
  );
  // Локальные таймеры для отображения КД (как в Menu)
  const [waterLeft, setWaterLeft] = React.useState(0);
  const [fertilizeLeft, setFertilizeLeft] = React.useState(0);
  React.useEffect(() => {
    function updateTimes() {
      const progress =
        JSON.parse(localStorage.getItem("flowersim.progress") || "{}") || {};
      const now = Date.now();
      const lastWater = progress?.lastWater || 0;
      const lastFertilize = progress?.lastFertilize || 0;
      setWaterLeft(Math.max(0, 30 * 60 * 1000 - (now - lastWater)));
      setFertilizeLeft(Math.max(0, 2 * 60 * 60 * 1000 - (now - lastFertilize)));
    }
    updateTimes();
    const interval = setInterval(updateTimes, 200);
    return () => clearInterval(interval);
  }, []);
  function getTimeLeftText(ms: number) {
    if (ms <= 0) return "";
    const min = Math.ceil(ms / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${h}ч ${m}м`;
    return `${m}м`;
  }
  React.useEffect(() => {
    const handler = () => {
      const coinsValue = Number(localStorage.getItem("progress_coins") || 0);
      setCoins(coinsValue);
      // Отправка монет на сервер
      const nickname = localStorage.getItem("flowersim.user");
      if (nickname) {
        fetch(`${API_BASE}/coins`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname, coins: coinsValue }),
        });
      }
    };
    window.addEventListener("storage", handler);
    const interval = setInterval(handler, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // --- Пробуждение горшка и прогресс-бар ---
  const AWAKEN_KEY = "pot_awaken_start";
  const AWAKEN_DURATION = 5 * 60 * 1000; // 5 минут
  const [awakenStart, setAwakenStart] = React.useState<number>(() =>
    Number(localStorage.getItem(AWAKEN_KEY) || 0)
  );
  const [now, setNow] = React.useState<number>(Date.now());
  const [collecting, setCollecting] = React.useState(false);
  React.useEffect(() => {
    if (!flowerVisible) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [flowerVisible]);
  const awakenActive =
    flowerVisible && awakenStart > 0 && now - awakenStart < AWAKEN_DURATION;
  const awakenPercent = awakenActive
    ? Math.min(100, ((now - awakenStart) / AWAKEN_DURATION) * 100)
    : awakenStart && flowerVisible
    ? 100
    : 0;
  const awakenTimeLeft = awakenActive
    ? Math.max(0, AWAKEN_DURATION - (now - awakenStart))
    : 0;
  function formatAwakenTime(ms: number) {
    if (ms <= 0) return "Готово!";
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }
  function handleAwakenStart() {
    const t = Date.now();
    setAwakenStart(t);
    localStorage.setItem(AWAKEN_KEY, String(t));
    // --- Логика для заданий "Пробудить горшок" ---
    // Считаем количество нажатий
    let awakenCount =
      Number(localStorage.getItem("tasks_awaken_count") || 0) + 1;
    localStorage.setItem("tasks_awaken_count", String(awakenCount));
    // Обновляем прогресс заданий
    let completed: Record<string, boolean> = {};
    try {
      completed =
        JSON.parse(localStorage.getItem("tasks_completed") || "{}") || {};
    } catch {}
    // Одиночное задание
    if (!completed["пробудить горшок"] && awakenCount >= 1)
      completed["пробудить горшок"] = true;
    // 10 раз
    if (!completed["пробудить горшок 10 раз"] && awakenCount >= 10)
      completed["пробудить горшок 10 раз"] = true;
    // 30 раз
    if (!completed["пробудить горшок 30 раз"] && awakenCount >= 30)
      completed["пробудить горшок 30 раз"] = true;
    localStorage.setItem("tasks_completed", JSON.stringify(completed));
  }
  // Вынесенный массив уровней для пробуждения
  const AWAKEN_LEVELS = [
    { level: 1, price: 500, reward: 10 },
    { level: 2, price: 800, reward: 20 },
    { level: 3, price: 1200, reward: 30 },
    { level: 4, price: 2000, reward: 40 },
    { level: 5, price: 2500, reward: 50 },
    { level: 6, price: 3000, reward: 60 },
    { level: 7, price: 3500, reward: 70 },
    { level: 8, price: 4000, reward: 80 },
    { level: 9, price: 4500, reward: 90 },
    { level: 10, price: 5000, reward: 100 },
    { level: 11, price: 6000, reward: 110 },
    { level: 12, price: 7000, reward: 120 },
    { level: 13, price: 8000, reward: 130 },
    { level: 14, price: 9000, reward: 140 },
    { level: 15, price: 10000, reward: 150 },
    { level: 16, price: 12000, reward: 160 },
    { level: 17, price: 13000, reward: 170 },
    { level: 18, price: 14000, reward: 180 },
    { level: 19, price: 15000, reward: 190 },
    { level: 20, price: 16000, reward: 200 },
  ];
  function handleAwakenCollect() {
    if (awakenPercent < 100 || collecting) return;
    setCollecting(true);
    // Награда зависит от уровня прокачки
    let reward = 5;
    if (upgradeLevel > 0) {
      const found = AWAKEN_LEVELS.find((l) => l.level === upgradeLevel);
      if (found) reward = found.reward;
    }
    const current = Number(localStorage.getItem("progress_coins") || 0);
    localStorage.setItem("progress_coins", String(current + reward));
    setTimeout(() => {
      setAwakenStart(0);
      localStorage.setItem(AWAKEN_KEY, "0");
      setCollecting(false);
      setCoins(current + reward);
    }, 400);
  }
  const bgMap: Record<string, string> = {
    "i.jpg": bg1,
    "i2.jpg": bg2,
    "i3.jpg": bg3,
    "i4.jpg": bg4,
    "i5.jpg": bg5,
    "i6.jpg": bg6,
    "i7.jpg": bg7,
    "i8.jpg": bg8,
    "i9.jpg": bg9,
    "i10.jpg": bg10,
    "i11.jpg": bg11,
    "i12.jpg": bg12,
    "i13.png": bg13,
    "i14.jpg": bg14,
    "i15.jpg": bg15,
    "i16.jpg": bg16,
    "Forest.jpg": forestBg,
    "loog.jpg": loogBg,
  };
  // Если фон не куплен, просто цвет
  const bought = (() => {
    try {
      return JSON.parse(localStorage.getItem("flowersim.bg.bought") || "[]");
    } catch {
      return [];
    }
  })();
  // Для временных фонов: если фон есть в bgMap и куплен, показываем его
  const isBgBought = mainBg && bought.includes(mainBg);
  const isTempBg = mainBg && (mainBg === "Forest.jpg" || mainBg === "loog.jpg");
  const bgUrl =
    mainBg && bgMap[mainBg] && (isBgBought || isTempBg)
      ? bgMap[mainBg]
      : undefined;
  const bgStyle = bgUrl
    ? { background: `url('${bgUrl}') center/cover no-repeat` }
    : { background: "#222" };

  // Локальные таймеры для отображения КД (как в Menu)

  // --- Функция форматирования времени КД (как в Menu) ---

  // --- Уведомление о размере цветка ---
  const [showSizeNotif, setShowSizeNotif] = React.useState(false);
  const [notifText, setNotifText] = React.useState("");
  // Размер цветка в процентах (0-100)
  const flowerPercent = Math.round((flowerSize / 380) * 100);

  // Обработчик клика по горшку
  const handlePotClick = () => {
    if (!flowerVisible) return;
    setNotifText(`Размер  ${flowerPercent}%`);
    setShowSizeNotif(true);
    setTimeout(() => setShowSizeNotif(false), 5000);
  };

  // --- Мини-игра: условный рендер ---
  const handleMiniGameClose = () => setShowMiniGame(null);
  const handleMiniGameWin = (
    earnedCoins: number,
    type: "clicker" | "falling" | "hitpot" | "dino" | "flappy"
  ) => {
    const current = Number(localStorage.getItem("progress_coins") || 0);
    localStorage.setItem("progress_coins", String(current + earnedCoins));
    setCoins(current + earnedCoins);
    // Установить КД только для сыгранной мини-игры
    let cd = MINI_GAME_CD;
    // Для ловца предметов при победе КД 5 секунд
    if (type === "falling") {
      cd = 5 * 60 * 1000;
    }
    const next = Date.now() + cd;
    if (type === "clicker") {
      localStorage.setItem(MINI_GAME_CLICKER_CD_KEY, String(next));
      setMiniGameClickerCooldown(cd);
    } else if (type === "falling") {
      localStorage.setItem(MINI_GAME_FALLING_CD_KEY, String(next));
      setMiniGameFallingCooldown(cd);
    } else if (type === "dino") {
      setMiniGameDinoCooldown(0);
    }
    setShowMiniGame(null);
  };

  // --- Игрушки ---

  const toyFiles = [
    "Ball.png",
    "Kyb.png",
    "BYBY.png",
    "gorshokBetaToy1.0.png",
    "Gusiniga.png",
    "Dragon.png",
    "AL.png",
  ];
  const toyImages: Record<string, string> = {
    "Ball.png": BallImg,
    "Kyb.png": KybImg,
    "BYBY.png": BYBYImg,
    "Gusiniga.png": GusinigaImg,
    "Dragon.png": DragonImg,
    "AL.png": ALImg,
    "gorshokBetaToy1.0.png": gorshokBetaToy,
  };
  const [activeToy, setActiveToy] = React.useState<string | null>(
    () => localStorage.getItem("flowersim.toyActive") || null
  );
  React.useEffect(() => {
    const handler = () =>
      setActiveToy(localStorage.getItem("flowersim.toyActive") || null);
    window.addEventListener("storage", handler);
    // Также слушаем клик по кнопке "Применить" через кастомное событие
    window.addEventListener("toyChanged", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("toyChanged", handler);
    };
  }, []);
  return (
    <Background style={bgStyle}>
      {/* Картинки над горшком при активных действиях */}
      <PotWrapper>
        {/* Отображение Woter.png и list.png над горшком */}
        {/* Если обе активны — WoterImg выше, ListImg ниже. Если только одна — по центру */}
        {canWater && !disableActions && (
          <img
            src={WoterImg}
            alt="Полить"
            style={{
              position: "absolute",
              left: "calc(50% + 50px)",
              top:
                canFertilize && !disableActions
                  ? "calc(50% - 92px)"
                  : "calc(50% - 65px)",
              transform: "translate(-50%, -50%)",
              width: 68,
              height: 68,
              zIndex: 20,
              pointerEvents: "none",
            }}
          />
        )}
        {canFertilize && !disableActions && (
          <img
            src={ListImg}
            alt="Удобрить"
            style={{
              position: "absolute",
              left: "calc(50% + 50px)",
              top:
                canWater && !disableActions
                  ? "calc(50% - 38px)"
                  : "calc(50% - 65px)",
              transform: "translate(-50%, -50%)",
              width: 54,
              height: 54,
              zIndex: 20,
              pointerEvents: "none",
            }}
          />
        )}
      </PotWrapper>
      {/* Модалка мини-игры */}
      <AnimatePresence>
        {showMiniGameModal && (
          <MiniGameModal
            clickerCooldown={miniGameClickerCooldown}
            fallingCooldown={miniGameFallingCooldown}
            dinoCooldown={miniGameDinoCooldown}
            onPlay={(game) => {
              setShowMiniGameModal(false);
              setShowMiniGame(game);
            }}
            onClose={() => setShowMiniGameModal(false)}
          />
        )}
      </AnimatePresence>
      {showMiniGame === "clicker" && (
        <MiniGame
          onClose={handleMiniGameClose}
          onWin={(coins) => handleMiniGameWin(coins, "clicker")}
        />
      )}
      {showMiniGame === "falling" && (
        <FallingObjectsGame
          onClose={() => {
            // При закрытии после проигрыша — дать КД 5 секунд
            const cd = 180000;
            const next = Date.now() + cd;
            localStorage.setItem("progress_mini_game_falling_cd", String(next));
            setMiniGameFallingCooldown(cd);
            setShowMiniGame(null);
          }}
          onWin={(coins) => handleMiniGameWin(coins, "falling")}
        />
      )}
      {showMiniGame === "dino" && (
        <DinoGame
          onClose={() => setShowMiniGame(null)}
          onWin={(coins) => handleMiniGameWin(coins, "dino")}
        />
      )}
      {showMiniGame === "flappy" && (
        <FlappyBirdScreen
          onExit={() => setShowMiniGame(null)}
          onWin={(coins) => handleMiniGameWin(coins, "flappy")}
        />
      )}
      {showMiniGame === "hitpot" && (
        <HitPotGame
          onClose={() => setShowMiniGame(null)}
          onWin={(coins: number) => handleMiniGameWin(coins, "hitpot")}
        />
      )}
      {/* Несколько жуков поверх всего, кроме модалок */}
      {beetles.map((type, idx) => (
        <img
          key={idx}
          src={type === 1 ? ShuckImg : Shuck2Img}
          alt="Жук"
          style={{
            position: "absolute",
            left: 0,
            top: idx === 0 ? 180 : 292, // первый жук над кнопкой "удобрить", второй над "полить"
            width: 90,
            height: 90,
            zIndex: 100, // поверх элементов, но ниже модалок
            pointerEvents: "none",
            transition: "opacity 0.3s",
          }}
        />
      ))}
      <CoinBarWrapper>
        <CoinIcon>
          <FaCoins />
        </CoinIcon>
        <CoinAmount>{coins}</CoinAmount>
      </CoinBarWrapper>
      {/* Хвостики-кнопки слева (полить/удобрить) */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 12,
        }}
      >
        <TailIconStyled
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick2();
            onFertilize();
          }}
          disabled={
            disableActions ||
            !canFertilize ||
            flowerPercent === 100 ||
            beetles.length > 0
          }
          style={{
            marginBottom: 6,
            opacity: 1,
            cursor: disableActions || !canFertilize ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              filter:
                !canFertilize && !disableActions
                  ? "blur(2.5px) grayscale(0.7)"
                  : "none",
              transition: "filter 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 100,
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            <FaLeaf size={32} color="#388e3c" />
          </span>
          {flowerPercent === 100 ? (
            <span
              style={{
                display: "block",
                fontSize: 18,
                color: "#388e3c",
                minWidth: 60,
                position: "relative",
                background: "none",
                borderRadius: 0,
                padding: 0,
                textAlign: "center",
                fontWeight: 700,
                zIndex: 3,
              }}
            >
              Макс.
            </span>
          ) : canFertilize || disableActions ? null : (
            <span
              style={{
                display: "block",
                fontSize: 18,
                color: "#553f09",
                minWidth: 60,
                position: "relative",
                background: "none",
                borderRadius: 0,
                padding: 0,
                textAlign: "center",
                fontWeight: 700,
                zIndex: 3,
              }}
            >
              {getTimeLeftText(fertilizeLeft)}
            </span>
          )}
        </TailIconStyled>
        <TailIconStyled
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick2();
            onWater();
            setShowLeika(true);
            setTimeout(() => setShowLeika(false), 4000);
          }}
          disabled={
            disableActions ||
            !canWater ||
            flowerPercent === 100 ||
            beetles.length === 2
          }
          style={{
            opacity: 1,
            cursor: disableActions || !canWater ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              filter:
                !canWater && !disableActions
                  ? "blur(2.5px) grayscale(0.7)"
                  : "none",
              transition: "filter 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 100,
              position: "absolute",
              left: 6,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            <FaTint size={32} color="#039be5" />
          </span>
          {flowerPercent === 100 ? (
            <span
              style={{
                display: "block",
                fontSize: 18,
                color: "#388e3c",
                minWidth: 60,
                position: "relative",
                background: "none",
                borderRadius: 0,
                padding: 0,
                textAlign: "center",
                fontWeight: 700,
                zIndex: 3,
              }}
            >
              Макс.
            </span>
          ) : canWater || disableActions ? null : (
            <span
              style={{
                display: "block",
                fontSize: 18,
                color: "#553f09",
                minWidth: 60,
                position: "relative",
                background: "none",
                borderRadius: 0,
                padding: 0,
                textAlign: "center",
                fontWeight: 700,
                zIndex: 3,
              }}
            >
              {getTimeLeftText(waterLeft)}
            </span>
          )}
        </TailIconStyled>
        {/* Кнопка "Обработать" */}
        <TailIconStyled
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick2();
            setShowObrab(true);
            setTimeout(() => setShowObrab(false), 4000);
            if (coins >= 20 && beetles.length > 0) {
              setCoins((c) => {
                const newCoins = c - 20;
                localStorage.setItem("progress_coins", String(newCoins));
                return newCoins;
              });
              setBeetles([]);
              localStorage.setItem("flowersim.beetles", JSON.stringify([]));
            }
          }}
          disabled={beetles.length === 0 || coins < 20}
          style={{
            opacity: beetles.length === 0 || coins < 20 ? 0.6 : 1,
            cursor:
              beetles.length === 0 || coins < 20 ? "not-allowed" : "pointer",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(270deg, #ffecb3 60%, #ffb300 100%)", // желтый градиент как у остальных
            marginTop: 38, // ещё ниже
            width:
              window.innerWidth <= 380 && window.innerHeight <= 670
                ? 40
                : window.innerWidth <= 362 && window.innerHeight <= 742
                ? 50
                : 60,
            minWidth:
              window.innerWidth <= 380 && window.innerHeight <= 670
                ? 40
                : window.innerWidth <= 362 && window.innerHeight <= 742
                ? 50
                : 60,
            maxWidth:
              window.innerWidth <= 380 && window.innerHeight <= 670
                ? 40
                : window.innerWidth <= 362 && window.innerHeight <= 742
                ? 50
                : 80,
            height:
              window.innerWidth <= 380 && window.innerHeight <= 670
                ? 66
                : window.innerWidth <= 362 && window.innerHeight <= 742
                ? 80
                : 130,
            minHeight:
              window.innerWidth <= 380 && window.innerHeight <= 670
                ? 66
                : window.innerWidth <= 362 && window.innerHeight <= 742
                ? 80
                : 130,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 100,
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            {/* Иконка обработки растений FaSprayCan тёмно-синяя, по центру */}
            <FaSprayCan size={32} color="#670f7d" />
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: "50%",
              bottom: 24,
              transform: "translateX(-50%)",
              background: "none",
              borderRadius: 0,
              padding: 0,
              textAlign: "center",
              fontWeight: 700,
              zIndex: 3,
              fontSize: 18,
              color: "#ffb300",
              gap: 4,
            }}
          >
            <FaCoins size={18} color="#9e8008" style={{ marginRight: 4 }} />
            <span style={{ color: "#9e8008" }}>20</span>
          </span>
        </TailIconStyled>
        {/* Кнопка мини-игры */}
        <TailIconStyled
          as={motion.button}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick2();
            setShowMiniGameModal(true);
          }}
          style={{
            opacity: 1,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(270deg, #ffecb3 60%, #ffb300 100%)",
            marginTop:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 18
                : 30,
            width:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 40
                : 60,
            minWidth:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 40
                : 60,
            maxWidth:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 40
                : 80,
            height:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 66
                : 130,
            minHeight:
              (window.innerWidth <= 380 && window.innerHeight <= 670) ||
              (window.innerWidth <= 362 && window.innerHeight <= 742)
                ? 66
                : 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "filter 0.2s, opacity 0.2s",
          }}
        >
          <FaGamepad size={32} color="#1a780e" />
        </TailIconStyled>
      </div>

      <div
        style={{
          position: "absolute",
          top: 180,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          zIndex: 12,
        }}
      >
        <TailIconStyled
          as={motion.button}
          small
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "24px 0 0 24px",
            borderLeft: "none",
            borderRight: "2px solid #ffb300",
          }}
          onClick={() => {
            playClick2();
            window.dispatchEvent(new CustomEvent("openShopModal"));
          }}
        >
          <FaStore size={32} color="#1b855e" />
        </TailIconStyled>
        <TailIconStyled
          as={motion.button}
          small
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "24px 0 0 24px",
            borderLeft: "none",
            borderRight: "2px solid #ffb300",
          }}
          onClick={() => {
            playClick2();
            window.dispatchEvent(new CustomEvent("openProgressModal"));
          }}
        >
          <FaGift size={32} color="#88181e" />
        </TailIconStyled>
        {/* Кнопка прокачки пробуждения */}
        <TailIconStyled
          as={motion.button}
          small
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "24px 0 0 24px",
            borderLeft: "none",
            borderRight: "2px solid #ffb300",
          }}
          onClick={() => {
            playClick2();
            setShowAwakenUpgrade(true);
          }}
        >
          <FaBolt size={32} color="#db8f14" />
        </TailIconStyled>
        <TailIconStyled
          as={motion.button}
          small
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "24px 0 0 24px",
            borderLeft: "none",
            borderRight: "2px solid #ffb300",
          }}
          onClick={() => {
            playClick2();
            window.dispatchEvent(new CustomEvent("openBackgroundModal"));
          }}
        >
          <FaImage size={32} color="#33bb94" />
        </TailIconStyled>
        <TailIconStyled
          as={motion.button}
          small
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "24px 0 0 24px",
            borderLeft: "none",
            borderRight: "2px solid #ffb300",
          }}
          onClick={() => {
            playClick2();
            window.dispatchEvent(new CustomEvent("openTasksModal"));
          }}
        >
          <MdAssignment size={32} color="#080808" />
        </TailIconStyled>
      </div>
      {/* Анимация лейки */}
      {showLeika && (
        <img
          src={LeikaImg}
          alt="Лейка"
          style={{
            position: "absolute",
            left: 160,
            top: 180,
            width: 120,
            height: 120,
            zIndex: 20,
            opacity: 1,
            transform: "rotate(-25deg)",
            animation: "leikaFade 4s forwards",
          }}
        />
      )}
      {/* Анимация обработки */}
      {showObrab && (
        <img
          src={ObrabImg}
          alt="Обработка"
          style={{
            position: "absolute",
            left: 160,
            top: 180,
            width: 120,
            height: 120,
            zIndex: 20,
            opacity: 1,
            animation: "leikaFade 4s forwards",
          }}
        />
      )}
      {/* Анимация удобрения */}
      {showYdobr && (
        <img
          src={YdobrImg}
          alt="Удобрение"
          style={{
            position: "absolute",
            left: 160, // было 35, стало 95
            top: 90,
            width: 120,
            height: 120,
            zIndex: 20,
            opacity: 1,
            animation: "ydobrShake 4s, ydobrFade 4s forwards",
          }}
        />
      )}
      <style>
        {`
          @keyframes leikaFade {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes ydobrFade {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes ydobrShake {
            0% { transform: translateX(0); }
            10% { transform: translateX(-5px); }
            20% { transform: translateX(5px); }
            30% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            50% { transform: translateX(-5px); }
            60% { transform: translateX(5px); }
            70% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
            90% { transform: translateX(0); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
      <PotWrapper>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 420,
            minHeight: 320,
            maxHeight: 480,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Flower
            size={Math.max(60, Math.min(flowerSize, 380))}
            visible={flowerVisible}
            marginBottom={
              potSkin === "gorshokDEMON.png" || potSkin === "gorshokAngel.png"
                ? -80
                : -40
            }
            skin={flowerSkin}
          />
          <div style={{ marginTop: 20, position: "relative", zIndex: 2 }}>
            <div
              style={{ cursor: "pointer", position: "relative" }}
              onClick={handlePotClick}
            >
              <Pot potSkin={potSkin} />
              {/* Игрушка всегда у низа горшка, двигается вместе с ним */}
              {activeToy && toyFiles.includes(activeToy) && (
                <img
                  src={toyImages[activeToy]}
                  style={{
                    position: "absolute",
                    left: 35,
                    bottom: -7,
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    zIndex: 120,
                    pointerEvents: "none",
                    filter: "drop-shadow(0 2px 12px #a1887f88)",
                  }}
                />
              )}
            </div>
          </div>
          {!flowerVisible && (
            <button
              onClick={onPlant}
              style={{
                marginTop: 24,
                padding: "12px 32px",
                fontSize: 20,
                borderRadius: 16,
                background: "#ffecb3",
                color: "#6d4c41",
                border: "2px solid #ffb300",
                fontWeight: 700,
                boxShadow: "0 2px 12px #ffb30044",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              Посадить цветок
            </button>
          )}
          {/* Кнопка пробуждения/бар/забрать монеты */}
          {/* Кнопка пробуждения/бар/забрать монеты теперь внутри PotWrapper, сразу под горшком */}
          {flowerVisible && (
            <AwakenWrapper>
              {awakenStart === 0 && (
                <AwakenButton
                  onClick={() => {
                    playClick2();
                    handleAwakenStart();
                  }}
                >
                  Пробудить горшок
                </AwakenButton>
              )}
              {awakenStart > 0 && awakenPercent < 100 && (
                <>
                  <AwakenBar>
                    <AwakenBarFill percent={awakenPercent} />
                    <span
                      style={{
                        position: "relative",
                        zIndex: 2,
                        fontSize: 16,
                        color: "#111",
                        fontWeight: 700,
                        width: "100%",
                        textAlign: "center",
                        letterSpacing: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      До{" "}
                      {(() => {
                        let reward = 5;
                        if (upgradeLevel > 0) {
                          const found = AWAKEN_LEVELS.find(
                            (l) => l.level === upgradeLevel
                          );
                          if (found) reward = found.reward;
                        }
                        return `${reward} монет`;
                      })()}
                      : {formatAwakenTime(awakenTimeLeft)}
                    </span>
                  </AwakenBar>
                  <AwakenButton disabled>В процессе...</AwakenButton>
                </>
              )}
              {awakenStart > 0 && awakenPercent === 100 && (
                <AwakenButton
                  onClick={() => {
                    playClick2();
                    handleAwakenCollect();
                  }}
                  disabled={collecting}
                >
                  {collecting ? "Забираем..." : "Забрать монетки"}
                </AwakenButton>
              )}
            </AwakenWrapper>
          )}
        </div>
        <AnimatePresence>
          {showSizeNotif && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "fixed",
                top: "calc(50% - 130px)",
                left: "calc(50% - 90px)",
                transform: "translate(-50%, -50%)",
                background: "#ffecb3",
                color: "#6d4c41",
                padding: "14px 36px",
                borderRadius: 18,
                boxShadow: "0 2px 16px #a1887f44",
                fontWeight: "bold",
                fontSize: 20,
                zIndex: 99999,
                textAlign: "center",
                pointerEvents: "none",
                minWidth: 120,
                maxWidth: "90vw",
              }}
            >
              {notifText}
            </motion.div>
          )}
        </AnimatePresence>
      </PotWrapper>
      {/* Модалка прокачки пробуждения */}
      <AnimatePresence>
        {showAwakenUpgrade && (
          <AwakenUpgradeModal
            onClose={handleCloseAwakenUpgrade}
            coins={coins}
            setCoins={setCoins}
            upgradeLevel={upgradeLevel}
            setUpgradeLevel={setUpgradeLevel}
          />
        )}
      </AnimatePresence>
      <Footer>
        Ver. 1.13 by -
        <a
          href="https://t.me/Hellmorphin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hellmorphin
        </a>
        <P>-</P>
      </Footer>
    </Background>
  );
};
export default MainScreen;
