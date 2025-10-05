import React from "react";
import LeikaImg from "../assets/Leika.png";
import YdobrImg from "../assets/Ydobr.png";
import styled from "styled-components";
import Pot from "./Pot";
import Flower from "./Flower";
import { FaCoins, FaTint } from "react-icons/fa";
import { GiFertilizerBag } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import bg1 from "../assets/i.jpg";
import bg2 from "../assets/i2.jpg";
import bg3 from "../assets/i3.jpg";
import bg4 from "../assets/i4.jpg";
import bg5 from "../assets/i5.jpg";
import bg6 from "../assets/i6.jpg";
import forestBg from "../assets/Forest.jpg";
import loogBg from "../assets/loog.jpg";

// --- Меню монеток ---
const CoinBarWrapper = styled.div`
  position: absolute;
  top: 48px; /* было 18px, стало ниже на 30px */
  left: 100px; /* было 110px, стало левее на 10px */
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

const TailIconStyled = styled(motion.button)`
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
`;

const PotWrapper = styled.div`
  position: absolute;
  left: calc(50% + 25px);
  bottom: 28vh;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 700px) {
    left: calc(50% + 5px);
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
  onWater: () => void;
  onFertilize: () => void;
  canWater?: boolean;
  canFertilize?: boolean;
  disableActions?: boolean;
  tutorialStep?: number;
  // waterLeftMs?: number;
  // fertilizeLeftMs?: number;
  // getTimeLeftText?: (ms: number) => string;
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
  tutorialStep,
  // waterLeftMs,
  // fertilizeLeftMs,
  // getTimeLeftText,
}) => {
  // --- Монеты ---
  const flowerSkin =
    localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
  const [coins, setCoins] = React.useState<number>(
    Number(localStorage.getItem("progress_coins") || 0)
  );
  React.useEffect(() => {
    const handler = () =>
      setCoins(Number(localStorage.getItem("progress_coins") || 0));
    window.addEventListener("storage", handler);
    // Для синхронизации при изменении монет из ProgressModal
    const interval = setInterval(handler, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);
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

  // --- Функция форматирования времени КД (как в Menu) ---
  function getTimeLeftText(ms: number) {
    if (ms <= 0) return "";
    const min = Math.ceil(ms / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${h}ч ${m}м`;
    return `${m}м`;
  }

  // --- Уведомление о размере цветка ---
  const [showSizeNotif, setShowSizeNotif] = React.useState(false);
  const [notifText, setNotifText] = React.useState("");
  // Размер цветка в процентах (0-100)
  const flowerPercent = Math.round((flowerSize / 380) * 100);

  // Обработчик клика по горшку
  const handlePotClick = () => {
    if (!flowerVisible) return;
    setNotifText(`Размер цветка  ${flowerPercent}%`);
    setShowSizeNotif(true);
    setTimeout(() => setShowSizeNotif(false), 5000);
  };

  return (
    <Background style={bgStyle}>
      <CoinBarWrapper>
        <CoinIcon>
          <FaCoins />
        </CoinIcon>
        <CoinAmount>{coins}</CoinAmount>
      </CoinBarWrapper>
      {/* Кнопки "Удобрить" и "Полить" слева — как хвостик, с таймером */}
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
          onClick={onFertilize}
          disabled={disableActions || !canFertilize}
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
            <GiFertilizerBag size={32} color="#2c7a14" />
          </span>
          {canFertilize || disableActions ? null : (
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
          onClick={onWater}
          disabled={disableActions || !canWater}
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
          {canWater || disableActions ? null : (
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
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
        </div>
        <AnimatePresence>
          {showSizeNotif && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                top: -60,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#ffecb3",
                color: "#6d4c41",
                padding: "14px 36px",
                borderRadius: 18,
                boxShadow: "0 2px 16px #a1887f44",
                fontWeight: "bold",
                fontSize: 20,
                zIndex: 1000,
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              {notifText}
            </motion.div>
          )}
        </AnimatePresence>
      </PotWrapper>
      <Footer>
        Ver. 1.6.2 by -
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
