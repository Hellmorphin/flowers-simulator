import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ModalOverlay = styled(motion.div)`
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

const ModalBox = styled(motion.div)`
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

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  width: 100%;
`;

// Список скинов горшков и условия открытия (часы)
const potSkins = [
  { name: "Стандартный", file: "gorshok.jpg", unlock: 0 },
  { name: "BLACK", file: "gorshokBLACK.png", unlock: 1 },
  { name: "Flowers", file: "gorshoflowers.png", unlock: 5 },
  { name: "Adidas", file: "gorshokadidas.png", unlock: 24 },
  { name: "Beta", file: "gorshokBeta1.0.png", unlock: 48 },
  { name: "Legacy", file: "gorshoklegaci.png", unlock: 72 },
  { name: "BLACK Legacy", file: "gorshokBLACKlegaci.png", unlock: 96 },
  { name: "Loading", file: "gorshokLoadingpng.png", unlock: 120 },
  { name: "Gold", file: "gorshokGold.png", unlock: 100 }, // Gold — за 100 часов
];

const POTS_KEY = "flowersim.potSkin";
const PLAYTIME_KEY = "flowersim.playtime";
const PLAYTIME_LAST_TS_KEY = "flowersim.playtime.lastts";

const ShopModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<"pot" | "flower">("pot");
  const [selected, setSelected] = useState<string>(
    () => localStorage.getItem(POTS_KEY) || "gorshok.jpg"
  );
  const [playTime, setPlayTime] = useState<number>(() => {
    const saved = Number(localStorage.getItem(PLAYTIME_KEY)) || 0;
    const lastTs =
      Number(localStorage.getItem(PLAYTIME_LAST_TS_KEY)) || Date.now();
    const now = Date.now();
    // разница в миллисекундах, переводим в часы
    const diffHrs = (now - lastTs) / 1000 / 60 / 60;
    // если был афк — добавить к saved
    if (diffHrs > 0.01) {
      localStorage.setItem(PLAYTIME_KEY, String(saved + diffHrs));
    }
    localStorage.setItem(PLAYTIME_LAST_TS_KEY, String(now));
    return saved + diffHrs;
  });
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [newUnlock, setNewUnlock] = useState<string | null>(null);

  // Считаем открытые скины
  useEffect(() => {
    const nowUnlocked = potSkins
      .filter((s) => playTime >= s.unlock)
      .map((s) => s.file);
    setUnlocked(nowUnlocked);
    // Показываем уведомление если только что открылся новый
    const prev = JSON.parse(
      localStorage.getItem("flowersim.unlockedPots") || "[]"
    );
    const diff = nowUnlocked.filter((f) => !prev.includes(f));
    if (diff.length > 0) {
      setNewUnlock(diff[0]);
      setTimeout(() => setNewUnlock(null), 4000);
      localStorage.setItem(
        "flowersim.unlockedPots",
        JSON.stringify(nowUnlocked)
      );
    }
  }, [playTime]);

  // Реальное уменьшение времени до открытия горшков (каждую минуту +1/60 часа) + поддержка AFK
  useEffect(() => {
    const updatePlayTime = () => {
      const now = Date.now();
      const lastTs = Number(localStorage.getItem(PLAYTIME_LAST_TS_KEY)) || now;
      const prev = Number(localStorage.getItem(PLAYTIME_KEY)) || 0;
      const diffHrs = (now - lastTs) / 1000 / 60 / 60;
      if (diffHrs > 0.0001) {
        const next = prev + diffHrs;
        setPlayTime(next);
        localStorage.setItem(PLAYTIME_KEY, String(next));
        localStorage.setItem(PLAYTIME_LAST_TS_KEY, String(now));
      } else {
        setPlayTime(prev);
        localStorage.setItem(PLAYTIME_LAST_TS_KEY, String(now));
      }
    };
    updatePlayTime();
    const timer = setInterval(updatePlayTime, 60000); // 1 минута
    return () => clearInterval(timer);
  }, []);

  // Применить скин
  const handleApply = (file: string) => {
    setSelected(file);
    localStorage.setItem(POTS_KEY, file);
  };
  // Снять скин
  const handleReset = () => {
    setSelected("gorshok.jpg");
    localStorage.setItem(POTS_KEY, "gorshok.jpg");
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalBox
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <CloseBtn onClick={onClose} title="Закрыть">
          ×
        </CloseBtn>
        <Title>Магазин</Title>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            onClick={() => setTab("pot")}
            style={{ fontWeight: tab === "pot" ? "bold" : 400, minWidth: 100 }}
          >
            Горшок
          </button>
          <button
            onClick={() => setTab("flower")}
            style={{
              fontWeight: tab === "flower" ? "bold" : 400,
              minWidth: 100,
            }}
          >
            Цветок
          </button>
        </div>
        {tab === "pot" && (
          <div
            style={{
              width: "100%",
              maxHeight: 320,
              minHeight: 180,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingBottom: 8,
              scrollbarWidth: "none",
              scrollbarColor: "transparent transparent",
            }}
          >
            {potSkins.map((skin) => (
              <div
                key={skin.file}
                style={{
                  border:
                    "2px solid " +
                    (selected === skin.file ? "#ffb300" : "#ccc"),
                  borderRadius: 16,
                  padding: 12,
                  background: "#fffde7",
                  minWidth: 120,
                  maxWidth: 180,
                  position: "relative",
                  opacity: unlocked.includes(skin.file) ? 1 : 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={new URL(`../assets/${skin.file}`, import.meta.url).href}
                  alt={skin.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: 8,
                    textAlign: "center",
                    color: skin.name === "Стандартный" ? "#ff6f00" : undefined,
                  }}
                >
                  {skin.name}
                </div>
                {unlocked.includes(skin.file) ? (
                  selected === skin.file ? (
                    <button
                      onClick={handleReset}
                      style={{
                        background: "#eee",
                        color: "#6d4c41",
                        border: "none",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontWeight: "bold",
                        margin: "0 auto",
                        display:
                          skin.name === "Стандартный" &&
                          window.innerWidth <= 700
                            ? "none"
                            : undefined,
                      }}
                    >
                      Снять
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(skin.file)}
                      style={{
                        background: "#ffb300",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontWeight: "bold",
                        margin: "0 auto",
                      }}
                    >
                      Применить
                    </button>
                  )
                ) : (
                  (() => {
                    const left = Math.max(0, skin.unlock - playTime);
                    if (left >= 1) {
                      // Показываем только целые часы
                      return (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#ff6f00",
                            textAlign: "center",
                            fontWeight: 700,
                          }}
                        >
                          Откроется через {Math.ceil(left)}ч
                        </div>
                      );
                    } else if (left > 0) {
                      // Меньше часа — показываем минуты
                      const mins = Math.ceil(left * 60);
                      return (
                        <div
                          style={{
                            fontSize: 13,
                            color: "#ff6f00",
                            textAlign: "center",
                            fontWeight: 700,
                          }}
                        >
                          Откроется через {mins}м
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })()
                )}
              </div>
            ))}
            <style>{`
              .shop-pots-scroll::-webkit-scrollbar { display: none; }
            `}</style>
          </div>
        )}
        {tab === "flower" && (
          <div style={{ color: "#6d4c41", opacity: 0.7 }}>
            Скоро будут доступны скины для цветка!
          </div>
        )}
        {newUnlock && (
          <div
            style={{
              position: "fixed",
              bottom: 32,
              left: 0,
              width: "100%",
              textAlign: "center",
              zIndex: 3000,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#ffecb3",
                color: "#6d4c41",
                padding: "12px 32px",
                borderRadius: 16,
                boxShadow: "0 2px 16px #a1887f44",
                fontWeight: "bold",
              }}
            >
              В магазине открылся новый горшок!
            </div>
          </div>
        )}
      </ModalBox>
    </ModalOverlay>
  );
};

export default ShopModal;
