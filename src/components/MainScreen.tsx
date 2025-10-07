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
import WoterImg from "../assets/Woter.png";
import ListImg from "../assets/list.png";
import YdobrImg from "../assets/Ydobr.png";
import styled from "styled-components";
import Pot from "./Pot";
import Flower from "./Flower";
import { FaCoins, FaStore, FaGift, FaImage, FaBolt } from "react-icons/fa";
import { FaTint, FaLeaf } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import bg1 from "../assets/i.jpg";
import bg2 from "../assets/i2.jpg";
import bg3 from "../assets/i3.jpg";
import bg4 from "../assets/i4.jpg";
import bg5 from "../assets/i5.jpg";
import bg6 from "../assets/i6.jpg";
import forestBg from "../assets/Forest.jpg";
import loogBg from "../assets/loog.jpg";
import AwakenUpgradeModal from "./AwakenUpgradeModal";
import Click2 from "../assets/Click2.mp3";
import Click3 from "../assets/Click3.mp3";

// --- Меню монеток ---
const CoinBarWrapper = styled.div`
  position: absolute;
  top: 48px; /* было 18px, стало ниже на 30px */
  left: 105px; /* было 110px, стало левее на 10px */
  z-index: 10;
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
    `}
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
  showLeika,
  showYdobr,
  onPlant,
  onWater,
  onFertilize,
  canWater,
  canFertilize,
  disableActions,
}) => {
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
    const handler = () =>
      setCoins(Number(localStorage.getItem("progress_coins") || 0));
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
  }
  function handleAwakenCollect() {
    if (awakenPercent < 100 || collecting) return;
    setCollecting(true);
    // Награда зависит от уровня прокачки
    const LEVELS = [
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
    ];
    let reward = 5;
    if (upgradeLevel > 0) {
      const found = LEVELS.find((l) => l.level === upgradeLevel);
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

  return (
    <Background style={bgStyle}>
      {/* Фиксированные иконки полива и удобрения справа от цветка */}
      {flowerVisible && (canWater || canFertilize) && (
        <div
          style={{
            position: "absolute",
            left: "calc(50% + 50px)",
            top:
              window.innerWidth === 375 && window.innerHeight === 667
                ? "calc(50% + 25px)"
                : "calc(50% + 10px)",
            transform: "translate(-50%, -100%)",
            zIndex: 9, // ниже модалок
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: canWater && canFertilize ? 2 : 0,
            pointerEvents: "none",
          }}
        >
          {canWater && (
            <img
              src={WoterImg}
              alt="Полить"
              style={{
                width: 72,
                height: 72,
                marginBottom: canFertilize ? 2 : 0,
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
                zIndex: 9,
              }}
            />
          )}
          {canFertilize && (
            <img
              src={ListImg}
              alt="Удобрить"
              style={{
                width: 72,
                height: 72,
                pointerEvents: "none",
                userSelect: "none",
                display: "block",
                zIndex: 9,
              }}
            />
          )}
        </div>
      )}
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
          disabled={disableActions || !canFertilize || flowerPercent === 100}
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
          }}
          disabled={disableActions || !canWater || flowerPercent === 100}
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
      </div>
      {/* Хвостики-кнопки справа */}
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
            left: 160, // было 50, стало 110
            top: 120,
            width: 60,
            height: 60,
            zIndex: 20,
            transform: "rotate(-60deg)",
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
            <div style={{ cursor: "pointer" }} onClick={handlePotClick}>
              <Pot potSkin={potSkin} />
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
                <AwakenButton onClick={() => { playClick2(); handleAwakenStart(); }}>
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
                      До монет: {formatAwakenTime(awakenTimeLeft)}
                    </span>
                  </AwakenBar>
                  <AwakenButton disabled>В процессе...</AwakenButton>
                </>
              )}
              {awakenStart > 0 && awakenPercent === 100 && (
                <AwakenButton
                  onClick={() => { playClick2(); handleAwakenCollect(); }}
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
        Ver. 1.6.4 by -
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
