
import React from "react";
import styled from "styled-components";
import Pot from "./Pot";
import Flower from "./Flower";
import { FaCoins } from "react-icons/fa";
import bg1 from "../assets/i.jpg";
import bg2 from "../assets/i2.jpg";
import bg3 from "../assets/i3.jpg";
import bg4 from "../assets/i4.jpg";
import bg5 from "../assets/i5.jpg";
import bg6 from "../assets/i6.jpg";

// --- Меню монеток ---
const CoinBarWrapper = styled.div`
  position: absolute;
  top: 18px;
  left: 110px;
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
  left: 0;
  width: 100vw;
  text-align: center;
  color: #fffde7;
  font-size: 1rem;
  opacity: 0.8;
  z-index: 3;
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
};

const MainScreen: React.FC<MainScreenProps> = ({
  // ...existing code...
  flowerSize,
  flowerVisible,
  potSkin,
  mainBg,
}) => {
  // --- Монеты ---
  const flowerSkin = localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
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
  };
  // Если фон не куплен, просто цвет
  const bought = (() => {
    try {
      return JSON.parse(localStorage.getItem("flowersim.bg.bought") || "[]");
    } catch {
      return [];
    }
  })();
  const isBgBought = mainBg && bought.includes(mainBg);
  const bgUrl =
    mainBg && isBgBought && bgMap[mainBg] ? bgMap[mainBg] : undefined;
  const bgStyle = bgUrl
    ? { background: `url('${bgUrl}') center/cover no-repeat` }
    : { background: "#222" };
  return (
    <Background style={bgStyle}>
      <CoinBarWrapper>
        <CoinIcon>
          <FaCoins />
        </CoinIcon>
        <CoinAmount>{coins}</CoinAmount>
      </CoinBarWrapper>
      <PotWrapper>
  <div style={{ position: 'relative', width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Flower
            size={Math.max(60, Math.min(flowerSize * 0.8, 380))}
            visible={flowerVisible}
            marginBottom={
              potSkin === "gorshokDEMON.png" || potSkin === "gorshokAngel.png"
                ? -80
                : -40
            }
            skin={flowerSkin}
          />
          <div style={{ marginTop: 20, position: 'relative', zIndex: 2 }}>
            <Pot potSkin={potSkin} />
          </div>
        </div>
      </PotWrapper>
      <Footer>
        Ver. 1.2.2 by{' '}
        <a
          href="https://t.me/Hellmorphin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hellmorphin
        </a>
      </Footer>
    </Background>
  );
}
export default MainScreen;
