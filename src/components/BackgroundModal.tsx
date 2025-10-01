import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCoins } from "react-icons/fa";
import bg1 from "../assets/i.jpg";
import bg2 from "../assets/i2.jpg";
import bg3 from "../assets/i3.jpg";
import bg4 from "../assets/i4.jpg";
import bg5 from "../assets/i5.jpg";
import bg6 from "../assets/i6.jpg";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 2rem;
  box-shadow: 0 8px 32px #6d4c4133;
  min-width: 0;
  max-width: 600px;
  min-height: 220px;
  max-height: 90dvh;
  padding: 2.5rem 3vw 2rem 3vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  gap: 24px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 700px) {
    max-width: calc(100vw + 30px);
    margin-left: -15px;
    margin-right: -15px;
    padding: 2.5rem calc(2vw + 15px) 2rem calc(2vw + 15px);
  }
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  width: 100%;
`;

const BgList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
  margin-bottom: 18px;
`;

const BgItem = styled.div`
  background: #fffde7;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px #a1887f44;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  max-width: 160px;
`;

const BgPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  margin-bottom: 8px;
  border: 2px solid #ffe082;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BgName = styled.div`
  font-weight: 600;
  color: #6d4c41;
  margin-bottom: 6px;
`;

const BgPrice = styled.div`
  color: #ff9800;
  font-size: 1em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BgButton = styled.button`
  background: #222;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-weight: bold;
  font-size: 1em;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin: 0.7rem 0;
  width: 100%;
  max-width: 120px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  &:hover {
    background: #444;
  }
  &:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #6d4c41;
  cursor: pointer;
  z-index: 10;
  @media (max-width: 700px) {
    top: -0.9rem;
    right: -0.9rem;
  }
`;

const BG_KEY = "flowersim.bg";
const BG_BOUGHT_KEY = "flowersim.bg.bought";
const COINS_KEY = "progress_coins";

const backgrounds = [
  { name: "i.jpg", src: bg1, price: 70 },
  { name: "i2.jpg", src: bg2, price: 70 },
  { name: "i3.jpg", src: bg3, price: 70 },
  { name: "i4.jpg", src: bg4, price: 100 },
  { name: "i5.jpg", src: bg5, price: 100 },
  { name: "i6.jpg", src: bg6, price: 100 },
];

export interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (bg: string | null) => void;
  currentBg: string | null;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentBg,
}) => {
  const [coins, setCoins] = useState<number>(
    Number(localStorage.getItem(COINS_KEY) || 0)
  );
  const [bought, setBought] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(BG_BOUGHT_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    const handler = () =>
      setCoins(Number(localStorage.getItem(COINS_KEY) || 0));
    window.addEventListener("storage", handler);
    const interval = setInterval(handler, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, [isOpen]);

  const handleBuy = (bg: string) => {
    const bgObj = backgrounds.find((b) => b.name === bg);
    const price = bgObj?.price || 100;
    if (coins < price) return;
    setCoins((c) => {
      const newCoins = c - price;
      localStorage.setItem(COINS_KEY, String(newCoins));
      return newCoins;
    });
    setBought((b) => {
      const newBought = [...b, bg];
      localStorage.setItem(BG_BOUGHT_KEY, JSON.stringify(newBought));
      return newBought;
    });
  };

  const handleApply = (bg: string) => {
    localStorage.setItem(BG_KEY, bg);
    window.dispatchEvent(new Event("storage"));
    onApply(bg);
  };

  const handleReset = () => {
    localStorage.removeItem(BG_KEY);
    window.dispatchEvent(new Event("storage"));
    onApply(null);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose} title="Закрыть">
          ×
        </CloseBtn>
        <Title>Фоны</Title>
        <BgList>
          {backgrounds.map((bg) => (
            <BgItem key={bg.name}>
              <BgPreview>
                <img
                  src={bg.src}
                  alt={bg.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "1rem",
                  }}
                />
              </BgPreview>
              {!bought.includes(bg.name) ? (
                <>
                  <BgPrice>
                    <FaCoins style={{ color: "#FFD700", marginRight: 6 }} />{" "}
                    {bg.price}
                  </BgPrice>
                  <BgButton
                    disabled={coins < bg.price}
                    onClick={() => handleBuy(bg.name)}
                  >
                    Купить
                  </BgButton>
                </>
              ) : currentBg === bg.name ? (
                <BgButton
                  style={{ background: "#ffe082", color: "#222" }}
                  onClick={handleReset}
                >
                  Снять
                </BgButton>
              ) : (
                <BgButton onClick={() => handleApply(bg.name)}>
                  Применить
                </BgButton>
              )}
            </BgItem>
          ))}
        </BgList>
      </ModalBox>
    </ModalOverlay>
  );
};

export default BackgroundModal;
