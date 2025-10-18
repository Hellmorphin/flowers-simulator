// --- ВРЕМЕННАЯ ИГРУШКА AL ---
function isALToyActive() {
  const now = new Date();
  // Владивосток UTC+10
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vladivostokTime = new Date(utc + 10 * 60 * 60000);
  const hours = vladivostokTime.getHours();
  const minutes = vladivostokTime.getMinutes();
  // Доступно с 16:11 до 22:00
  if (hours > 16 && hours < 22) return true;
  if (hours === 16 && minutes >= 15) return true;
  if (hours === 22 && minutes === 0) return true;
  return false;
}
import React, { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
// --- Воспроизведение звука Click4.mp3 для вкладок ---

// Получить временный горшок
// --- ВРЕМЕННОЕ ОКНО АКТИВАЦИИ ДЛЯ ВСЕХ ---
// Владивосток UTC+10, окно: 21:50–23:30, раз в 7 дней
function isTempPotGlobalActive() {
  // Владивосток UTC+10
  const now = new Date();
  // Получаем текущее время во Владивостоке
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vladivostokTime = new Date(utc + 10 * 60 * 60000);
  // День недели (0 — воскресенье, 1 — понедельник, ...)
  // Базовая точка отсчёта — среда 1 октября 2025, 00:00:00 UTC+10
  const base = Date.UTC(2025, 9, 1, 0, 0, 0) - 10 * 60 * 60 * 1000; // UTC
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const msSinceBase = vladivostokTime.getTime() - base;
  const weekNum = Math.floor(msSinceBase / weekMs);
  // Для текущей недели вычисляем дату окна раздачи во Владивостоке
  const windowStart = base + weekNum * weekMs + (21 * 60 + 50) * 60 * 1000; // 21:50 UTC+10
  const windowEnd = base + weekNum * weekMs + (23 * 60 + 30) * 60 * 1000; // 23:30 UTC+10
  return (
    vladivostokTime.getTime() >= windowStart &&
    vladivostokTime.getTime() <= windowEnd
  );
}
// --- ВРЕМЕННЫЕ ГОРШКИ ---
const TEMP_POT_KEY = "flowersim.tempPots";
const TEMP_POT_PERM_KEY = "flowersim.tempPots.permanent";
const TEMP_POT_DURATION = 3 * 60 * 60 * 1000; // 3 часа в мс
function isCatPotActive() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vladivostokTime = new Date(utc + 10 * 60 * 60000);
  const day = vladivostokTime.getDay(); // 5 — пятница
  const hours = vladivostokTime.getHours();
  return day === 5 && hours >= 0 && hours < 14;
}

const tempPots = [
  { name: "DEMON", file: "gorshokDEMON.png" },
  { name: "ROFL", file: "gorshokRofl.png" },
  { name: "Cat", file: "gorshokCat.png", isActive: isCatPotActive },
  { name: "Valera", file: "gorshokValera.png", isActive: isCatPotActive },
];
import {
  flowerSkins,
  TEMP_FLOWER_KEY,
  TEMP_FLOWER_PERM_KEY,
  TEMP_FLOWER_DURATION,
  isTempFlowerActive,
} from "./FlowerShopData";
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
  overflow-x: hidden;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d7ccc8;
    border-radius: 8px;
  }
  &::-webkit-scrollbar:horizontal {
    height: 0 !important;
    display: none !important;
    background: transparent !important;
  }
  &::-webkit-scrollbar:horizontal {
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
  { name: "Черный", file: "gorshokBLACK.png", unlock: 1 },
  { name: "Цветок", file: "gorshoflowers.png", unlock: 5 },
  { name: "Фиолетовый", file: "gorshokYYY.png", unlock: 10 },
  { name: "Оранжевый", file: "gorshokOrange.png", unlock: 15 },
  { name: "Абибас", file: "gorshokadidas.png", unlock: 24 },
  { name: "Beta", file: "gorshokBeta1.0.png", unlock: 48 },
  { name: "Legacy", file: "gorshoklegaci.png", unlock: 72 },
  { name: "Черный Legacy", file: "gorshokBLACKlegaci.png", unlock: 96 },

  { name: "Золото", file: "gorshokGold.png", unlock: 100 },
  { name: "Loading", file: "gorshokLoadingpng.png", unlock: 120 },
  { name: "Boss", file: "gorshokBoss.png", unlock: 150 },
  { name: "Ангел", file: "gorshokAngel.png", unlock: 200 }, // Gold — за 100 часов
  { name: "Фаза", file: "faza.png", unlock: 215 },
  { name: "Бакал", file: "gorshokgolda.png", unlock: 220 },
  { name: "Энергетик", file: "gorshoEnergypng.png", unlock: 230 },
  { name: "Туалет", file: "tyalet.png", unlock: 250 },
  { name: "Кубик", file: "gorshokmine.png", unlock: 280 },
  { name: "Флаг", file: "gorshokRus.png", unlock: 300 },
  { name: "Зубастик", file: "gorshokBlue.png", unlock: 320 },
  { name: "Молния", file: "gorshokRussia.png", unlock: 340 },
  { name: "Пузырик", file: "gorshoPar.png", unlock: 380 },
];

const POTS_KEY = "flowersim.potSkin";
const FLOWERS_KEY = "flowersim.flowerSkin";
const PLAYTIME_KEY = "flowersim.playtime";
const PLAYTIME_LAST_TS_KEY = "flowersim.playtime.lastts";

const ShopModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // --- Воспроизведение звука Click4.mp3 для вкладок ---
  // Для мгновенного отклика создаём новый Audio на каждый клик
  // Удаляем неиспользуемую функцию playClick4

  // Получить временной горшок
  const handleClaimTempPot = (file: string) => {
    let tempPermData: string[] = [];
    try {
      tempPermData = JSON.parse(
        localStorage.getItem(TEMP_POT_PERM_KEY) || "[]"
      );
    } catch {}
    if (!tempPermData.includes(file)) {
      tempPermData.push(file);
      localStorage.setItem(TEMP_POT_PERM_KEY, JSON.stringify(tempPermData));
      setUnlocked((prev) => Array.from(new Set([...prev, file])));
      setNewUnlock(file);
      setTimeout(() => setNewUnlock(null), 4000);
    }
  };
  // --- PlayTime ---
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
  // --- PlayTime ---
  // --- Магазин цветов ---
  const [selectedFlower, setSelectedFlower] = useState<string>(
    () => localStorage.getItem(FLOWERS_KEY) || "Flowers1.png"
  );
  const [unlockedFlowers, setUnlockedFlowers] = useState<string[]>([]);
  const [newFlowerUnlock, setNewFlowerUnlock] = useState<string | null>(null);
  // --- ЛОГИКА ВРЕМЕННЫХ ГОРШКОВ ---
  // ...существующий useEffect для playTime и unlocked...

  // --- ЛОГИКА МАГАЗИНА ЦВЕТОВ ---
  useEffect(() => {
    const now = Date.now();
    let nowUnlocked = flowerSkins
      .filter((s) => typeof s.unlock === "number" && playTime >= s.unlock)
      .map((s) => s.file);
    // Временные цветы
    let tempActive: string[] = [];
    let tempPermanent: string[] = [];
    try {
      const tempData = JSON.parse(
        localStorage.getItem(TEMP_FLOWER_KEY) || "{}"
      );
      const tempPermData = JSON.parse(
        localStorage.getItem(TEMP_FLOWER_PERM_KEY) || "[]"
      );
      for (const skin of flowerSkins) {
        if (skin.unlock === "temp" && tempData[skin.file]) {
          if (!tempPermData.includes(skin.file)) tempPermData.push(skin.file);
          if (now - tempData[skin.file] < TEMP_FLOWER_DURATION)
            tempActive.push(skin.file);
        }
        if (skin.unlock === "temp2" && tempData[skin.file]) {
          if (!tempPermData.includes(skin.file)) tempPermData.push(skin.file);
          if (now - tempData[skin.file] < TEMP_FLOWER_DURATION)
            tempActive.push(skin.file);
        }
      }
      localStorage.setItem(TEMP_FLOWER_PERM_KEY, JSON.stringify(tempPermData));
      tempPermanent = tempPermData;
    } catch {}
    nowUnlocked = nowUnlocked.concat(tempActive).concat(tempPermanent);
    const nowUnlockedUnique = Array.from(new Set(nowUnlocked));
    setUnlockedFlowers(nowUnlockedUnique);
    // уведомление
    const prev = JSON.parse(
      localStorage.getItem("flowersim.unlockedFlowers") || "[]"
    );
    const tempPermData = JSON.parse(
      localStorage.getItem(TEMP_FLOWER_PERM_KEY) || "[]"
    );
    // Показываем уведомление только если магазин открыт не просто так, а реально есть новые цветы
    if (prev.length > 0) {
      const diff = nowUnlockedUnique.filter(
        (f) => !prev.includes(f) && !tempPermData.includes(f)
      );
      if (diff.length > 0) {
        setNewFlowerUnlock(diff[0]);
        setTimeout(() => setNewFlowerUnlock(null), 4000);
        localStorage.setItem(
          "flowersim.unlockedFlowers",
          JSON.stringify([...prev, ...diff])
        );
      }
    } else {
      // Если это первый запуск — просто запоминаем стартовый набор, но не показываем уведомление
      localStorage.setItem(
        "flowersim.unlockedFlowers",
        JSON.stringify(nowUnlockedUnique)
      );
    }
  }, [playTime]);

  const handleApplyFlower = (file: string) => {
    setSelectedFlower(file);
    localStorage.setItem(FLOWERS_KEY, file);
  };
  const handleResetFlower = () => {
    setSelectedFlower("Flowers1.png");
    localStorage.setItem(FLOWERS_KEY, "Flowers1.png");
  };
  // Получить временный цветок
  const handleClaimTempFlower = (file: string) => {
    let tempPermData: string[] = [];
    try {
      tempPermData = JSON.parse(
        localStorage.getItem(TEMP_FLOWER_PERM_KEY) || "[]"
      );
    } catch {}
    if (!tempPermData.includes(file)) {
      tempPermData.push(file);
      localStorage.setItem(TEMP_FLOWER_PERM_KEY, JSON.stringify(tempPermData));
      setUnlockedFlowers((prev) => Array.from(new Set([...prev, file])));
      setNewFlowerUnlock(file);
      setTimeout(() => setNewFlowerUnlock(null), 4000);
    }
  };
  // useEffect для временных горшков больше не нужен — только кнопка 'Получить'!
  const [tab, setTab] = useState<"pot" | "toy" | "flower">("pot");

  // --- Игрушки ---
  const toys = [
    { name: "Мячик", file: "Ball.png", price: 800 },
    { name: "Кубик", file: "Kyb.png", price: 1200 },
    { name: "Заяц", file: "BYBY.png", price: 2000 },
    { name: "Горшочек", file: "gorshokBetaToy1.0.png", price: 2800 },
    { name: "Гусеница", file: "Gusiniga.png", price: 3500 },
    { name: "Дракон", file: "Dragon.png", price: 5000 },
  ];
  const TOYS_KEY = "flowersim.toys";
  const TOY_ACTIVE_KEY = "flowersim.toyActive";
  const [ownedToys, setOwnedToys] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(TOYS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [activeToy, setActiveToy] = useState<string | null>(
    () => localStorage.getItem(TOY_ACTIVE_KEY) || null
  );
  const [coins, setCoins] = useState<number>(
    Number(localStorage.getItem("progress_coins") || 0)
  );
  useEffect(() => {
    const handler = () =>
      setCoins(Number(localStorage.getItem("progress_coins") || 0));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const handleBuyToy = (file: string, price: number) => {
    if (coins < price) return;
    const updated = [...ownedToys, file];
    setOwnedToys(updated);
    localStorage.setItem(TOYS_KEY, JSON.stringify(updated));
    const newCoins = coins - price;
    setCoins(newCoins);
    localStorage.setItem("progress_coins", String(newCoins));
  };
  const handleApplyToy = (file: string) => {
    setActiveToy(file);
    localStorage.setItem(TOY_ACTIVE_KEY, file);
    window.dispatchEvent(new Event("toyChanged"));
  };
  const handleRemoveToy = () => {
    setActiveToy(null);
    localStorage.removeItem(TOY_ACTIVE_KEY);
    window.dispatchEvent(new Event("toyChanged"));
  };
  const [selected, setSelected] = useState<string>(
    () => localStorage.getItem(POTS_KEY) || "gorshok.jpg"
  );
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [newUnlock, setNewUnlock] = useState<string | null>(null);
  // Получить временный горшок

  // --- ЛОГИКА ВРЕМЕННЫХ ГОРШКОВ ---
  // Считаем открытые скины (обычные + временные активные + временные навсегда)
  useEffect(() => {
    const now = Date.now();
    // 1. Обычные горшки
    let nowUnlocked = potSkins
      .filter((s) => playTime >= s.unlock)
      .map((s) => s.file);

    // 2. Временные горшки: активные (3 часа) и навсегда
    let tempActive: string[] = [];
    let tempPermanent: string[] = [];
    try {
      const tempData = JSON.parse(localStorage.getItem(TEMP_POT_KEY) || "{}");
      const tempPermData = JSON.parse(
        localStorage.getItem(TEMP_POT_PERM_KEY) || "[]"
      );
      for (const pot of tempPots) {
        if (tempData[pot.file]) {
          // Если когда-либо активирован — добавить в постоянные
          if (!tempPermData.includes(pot.file)) tempPermData.push(pot.file);
          // Если ещё не истёк — добавить во временные
          if (now - tempData[pot.file] < TEMP_POT_DURATION)
            tempActive.push(pot.file);
        }
      }
      // Сохраняем навсегда полученные временные горшки
      localStorage.setItem(TEMP_POT_PERM_KEY, JSON.stringify(tempPermData));
      tempPermanent = tempPermData;
    } catch {}
    // Добавляем временные активные и навсегда
    nowUnlocked = nowUnlocked.concat(tempActive).concat(tempPermanent);
    // Убираем дубли
    const nowUnlockedUnique = Array.from(new Set(nowUnlocked));
    setUnlocked(nowUnlockedUnique);
    // Показываем уведомление если только что открылся новый
    const prev = JSON.parse(
      localStorage.getItem("flowersim.unlockedPots") || "[]"
    );
    const tempPermData = JSON.parse(
      localStorage.getItem(TEMP_POT_PERM_KEY) || "[]"
    );
    // Показываем уведомление только если магазин открыт не просто так, а реально есть новые горшки
    if (prev.length > 0) {
      const diff = nowUnlockedUnique.filter(
        (f) => !prev.includes(f) && !tempPermData.includes(f)
      );
      if (diff.length > 0) {
        setNewUnlock(diff[0]);
        setTimeout(() => setNewUnlock(null), 4000);
        localStorage.setItem(
          "flowersim.unlockedPots",
          JSON.stringify([...prev, ...diff])
        );
      }
    } else {
      // Если это первый запуск — просто запоминаем стартовый набор, но не показываем уведомление
      localStorage.setItem(
        "flowersim.unlockedPots",
        JSON.stringify(nowUnlockedUnique)
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
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
      onClick={onClose}
    >
      <ModalBox
        initial={false}
        animate={{ scale: 1 }}
        transition={{ duration: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseBtn
          onClick={() => {
            if (typeof window.playClick2 === "function") window.playClick2();
            onClose();
          }}
          title="Закрыть"
        >
          ×
        </CloseBtn>
        <Title>Магазин</Title>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 12,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            onClick={() => setTab("pot")}
            style={{
              fontWeight: tab === "pot" ? "bold" : 400,
              minWidth: 110,
              maxWidth: 320,
              background: tab === "pot" ? "#4e3f12" : "#4e3f12",
              color: "#ff9800",
            }}
          >
            Горшок
          </button>
          <button
            onClick={() => setTab("flower")}
            style={{
              fontWeight: tab === "flower" ? "bold" : 400,
              minWidth: 110,
              maxWidth: 320,
              background: tab === "flower" ? "#4e3f12" : "#4e3f12",
              color: "#ff9800",
            }}
          >
            Цветок
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => setTab("toy")}
            style={{
              fontWeight: tab === "toy" ? "bold" : 400,
              minWidth: 180,
              maxWidth: 320,
              background: tab === "toy" ? "#4e3f12" : "#4e3f12",
              color: "#ff9800",
            }}
          >
            Игрушки
          </button>
        </div>
        {tab === "toy" && (
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
            {/* Обычные игрушки */}
            {toys.map((toy) => (
              <div
                key={toy.file}
                style={{
                  border: "2px solid #ffecb3",
                  borderRadius: 16,
                  padding: 12,
                  background: "#ffecb3",
                  minWidth: 250,
                  maxWidth: 250,
                  position: "relative",
                  opacity: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 2px 8px #a1887f44",
                }}
              >
                <img
                  src={new URL(`../assets/${toy.file}`, import.meta.url).href}
                  alt={toy.name}
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
                    color: "#ff6f00",
                  }}
                >
                  {toy.name}
                </div>
                <div
                  style={{ color: "#6d4c41", fontWeight: 700, marginBottom: 8 }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FaCoins
                      size={18}
                      color="#ffb300"
                      style={{ marginRight: 2 }}
                    />
                    {toy.price}
                  </span>
                </div>
                {ownedToys.includes(toy.file) ? (
                  activeToy === toy.file ? (
                    <button
                      onClick={handleRemoveToy}
                      style={{
                        background: "#eee",
                        color: "#6d4c41",
                        border: "none",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontWeight: "bold",
                        margin: "0 auto",
                      }}
                    >
                      Снять
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyToy(toy.file)}
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
                  <button
                    onClick={() => handleBuyToy(toy.file, toy.price)}
                    disabled={coins < toy.price}
                    style={{
                      background: coins < toy.price ? "#ccc" : "#ffb300",
                      color: coins < toy.price ? "#888" : "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 12px",
                      fontWeight: "bold",
                      margin: "0 auto",
                      cursor: coins < toy.price ? "not-allowed" : "pointer",
                    }}
                  >
                    Купить
                  </button>
                )}
              </div>
            ))}
            {/* Временная игрушка AL */}
            {(() => {
              const alFile = "AL.png";
              const alName = "Valera";
              const available = isALToyActive();
              const owned = ownedToys.includes(alFile);
              const active = activeToy === alFile;
              // AL показывается если доступна по времени или уже получена
              if (!(available || owned)) {
                return (
                  <div
                    key={alFile}
                    style={{
                      border: "2px solid #ffecb3",
                      borderRadius: 16,
                      padding: 12,
                      background: "#ffecb3",
                      minWidth: 250,
                      maxWidth: 250,
                      position: "relative",
                      opacity: 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 2px 8px #a1887f44",
                    }}
                  >
                    <img
                      src={new URL(`../assets/${alFile}`, import.meta.url).href}
                      alt={alName}
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
                        color: "#ff6f00",
                      }}
                    >
                      {alName}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#bdbdbd",
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    >
                      Недоступно
                    </div>
                  </div>
                );
              }
              // Если AL уже получена — действия доступны всегда
              return (
                <div
                  key={alFile}
                  style={{
                    border: "2px solid #ffecb3",
                    borderRadius: 16,
                    padding: 12,
                    background: "#ffecb3",
                    minWidth: 250,
                    maxWidth: 250,
                    position: "relative",
                    opacity: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 2px 8px #a1887f44",
                  }}
                >
                  <img
                    src={new URL(`../assets/${alFile}`, import.meta.url).href}
                    alt={alName}
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
                      color: "#ff6f00",
                    }}
                  >
                    {alName}
                  </div>
                  {owned ? (
                    active ? (
                      <button
                        onClick={handleRemoveToy}
                        style={{
                          background: "#eee",
                          color: "#6d4c41",
                          border: "none",
                          borderRadius: 8,
                          padding: "4px 12px",
                          fontWeight: "bold",
                          margin: "0 auto",
                        }}
                      >
                        Снять
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyToy(alFile)}
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
                    <button
                      onClick={() => handleBuyToy(alFile, 0)}
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
                      Добавить
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        )}
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
            {/* Обычные скины */}
            {potSkins.map((skin) => (
              <div
                key={skin.file}
                style={{
                  border:
                    "2px solid " +
                    (selected === skin.file ? "#ffecb3" : "#ffecb3"),
                  borderRadius: 16,

                  padding: 12,
                  background: "#ffecb3",
                  minWidth: 250,
                  maxWidth: 250,
                  position: "relative",
                  opacity: unlocked.includes(skin.file) ? 1 : 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 2px 8px #a1887f44",
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
                    color: "#ff6f00",
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
            {/* Временные горшки */}
            {tempPots.map((skin) => {
              // Проверяем статус временного горшка
              let tempData: Record<string, number> = {};
              let tempPermData = [];
              let permanent = false;
              let leftMs = 0;
              try {
                tempData =
                  JSON.parse(localStorage.getItem(TEMP_POT_KEY) || "{}") || {};
                tempPermData =
                  JSON.parse(localStorage.getItem(TEMP_POT_PERM_KEY) || "[]") ||
                  [];
                if (tempData[skin.file]) {
                  leftMs =
                    TEMP_POT_DURATION - (Date.now() - tempData[skin.file]);
                  if (leftMs < 0) leftMs = 0;
                }
                if (tempPermData.includes(skin.file)) permanent = true;
              } catch {}
              const unlockedThis = permanent;
              const isActive =
                typeof skin.isActive === "function"
                  ? skin.isActive()
                  : isTempPotGlobalActive();
              const canClaim = isActive && !permanent;
              return (
                <div
                  key={skin.file}
                  style={{
                    border:
                      "2px solid " +
                      (selected === skin.file ? "#ffecb3" : "#ffecb3"),
                    borderRadius: 16,
                    padding: 12,
                    background: "#ffecb3",
                    minWidth: 250,
                    maxWidth: 250,
                    position: "relative",
                    opacity: unlockedThis ? 1 : 0.5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 2px 8px #a1887f44",
                  }}
                >
                  {/* % выращивания над картинкой */}
                  {/* У временных горшков не выводим процент выращивания */}
                  <img
                    src={
                      new URL(`../assets/${skin.file}`, import.meta.url).href
                    }
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
                      color: "#ff6f00",
                    }}
                  >
                    {skin.name}
                  </div>
                  {permanent ? (
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
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaimTempPot(skin.file)}
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
                      Получить
                    </button>
                  ) : (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#bdbdbd",
                        textAlign: "center",
                        fontWeight: 700,
                      }}
                    >
                      Недоступно
                    </div>
                  )}
                </div>
              );
            })}
            Я живой, правда :/
            <style>{`
              .shop-pots-scroll::-webkit-scrollbar { display: none; }
            `}</style>
          </div>
        )}
        {tab === "flower" && (
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
            {/* Обычные цветы */}
            {flowerSkins
              .filter((s) => typeof s.unlock === "number")
              .map((skin) => {
                // Получаем текущий скин цветка и его размер

                localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
                let flowerSize = 8;
                try {
                  // Берём объект размеров из flowersim.progress
                  const progress = JSON.parse(
                    localStorage.getItem("flowersim.progress") || "{}"
                  );
                  if (
                    progress &&
                    progress.flowerSizes &&
                    typeof progress.flowerSizes[skin.file] === "number"
                  ) {
                    flowerSize = progress.flowerSizes[skin.file];
                  }
                } catch {}
                // Вычисляем процент как в MainScreen
                let percent = Math.round((flowerSize / 380) * 100);
                if (percent < 8) percent = 8;
                return (
                  <div
                    key={skin.file}
                    style={{
                      border:
                        "2px solid " +
                        (selectedFlower === skin.file ? "#ffecb3" : "#ffecb3"),
                      borderRadius: 16,
                      padding: 12,
                      background: "#ffecb3",
                      minWidth: 250,
                      maxWidth: 250,
                      position: "relative",
                      opacity: unlockedFlowers.includes(skin.file) ? 1 : 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 2px 8px #a1887f44",
                    }}
                  >
                    {/* % выращивания над картинкой */}
                    {unlockedFlowers.includes(skin.file) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 0,
                          right: 0,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#df7513",
                          background: "rgba(228, 201, 123, 0.85)",
                          borderRadius: 10,

                          width: "80%",
                          margin: "0 auto",
                          zIndex: 10,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`Вырос на ${percent}%`}
                      </div>
                    )}
                    <img
                      src={
                        new URL(`../assets/${skin.file}`, import.meta.url).href
                      }
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
                        color: "#ff6f00",
                      }}
                    >
                      {skin.name}
                    </div>
                    {unlockedFlowers.includes(skin.file) ? (
                      selectedFlower === skin.file ? (
                        skin.file !== "Flowers1.png" ? (
                          <button
                            onClick={handleResetFlower}
                            style={{
                              background: "#eee",
                              color: "#6d4c41",
                              border: "none",
                              borderRadius: 8,
                              padding: "4px 12px",
                              fontWeight: "bold",
                              margin: "0 auto",
                            }}
                          >
                            Снять
                          </button>
                        ) : null
                      ) : skin.file !== "Flowers1.png" ? (
                        <button
                          onClick={() => handleApplyFlower(skin.file)}
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
                      ) : (
                        // Для стартового цветка: если открыт хотя бы один другой, показываем "Применить"
                        unlockedFlowers.filter((f) => f !== "Flowers1.png")
                          .length > 0 && (
                          <button
                            onClick={() => handleApplyFlower(skin.file)}
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
                      )
                    ) : (
                      (() => {
                        const left = Math.max(
                          0,
                          (skin.unlock as number) - playTime
                        );
                        if (left >= 1) {
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
                );
              })}
            {/* Временные цветы */}
            {flowerSkins
              .filter((s) => typeof s.unlock === "string")
              .map((skin) => {
                let tempData: Record<string, number> = {};
                let tempPermData: string[] = [];
                let permanent = false;
                let leftMs = 0;
                let flowerSize = 8;
                try {
                  tempData = JSON.parse(
                    localStorage.getItem(TEMP_FLOWER_KEY) || "{}"
                  );
                  tempPermData = JSON.parse(
                    localStorage.getItem(TEMP_FLOWER_PERM_KEY) || "[]"
                  );
                  // Берём размер из progress.flowerSizes
                  const progress = JSON.parse(
                    localStorage.getItem("flowersim.progress") || "{}"
                  );
                  if (
                    progress &&
                    progress.flowerSizes &&
                    typeof progress.flowerSizes[skin.file] === "number"
                  ) {
                    flowerSize = progress.flowerSizes[skin.file];
                  }
                  if (tempData[skin.file]) {
                    leftMs =
                      TEMP_FLOWER_DURATION - (Date.now() - tempData[skin.file]);
                    if (leftMs < 0) leftMs = 0;
                  }
                  if (tempPermData.includes(skin.file)) permanent = true;
                } catch {}
                let percent = Math.round((flowerSize / 380) * 100);
                if (percent < 8) percent = 8;
                const unlockedThis = permanent;
                // Кнопка "Получить" только в окно раздачи
                const tempActiveFlower = isTempFlowerActive();
                return (
                  <div
                    key={skin.file}
                    style={{
                      border:
                        "2px solid " +
                        (selectedFlower === skin.file ? "#ffecb3" : "#ffecb3"),
                      borderRadius: 16,
                      padding: 12,
                      background: "#ffecb3",
                      minWidth: 250,
                      maxWidth: 250,
                      position: "relative",
                      opacity: unlockedThis ? 1 : 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 2px 8px #a1887f44",
                    }}
                  >
                    {/* % выращивания над картинкой только если цветок открыт */}
                    {permanent && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 0,
                          right: 0,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 16,
                          color: "#df7513",
                          background: "rgba(228, 201, 123, 0.85)",
                          borderRadius: 10,
                          width: "80%",
                          margin: "0 auto",
                          zIndex: 10,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`Вырос на ${percent}%`}
                      </div>
                    )}
                    <img
                      src={
                        new URL(`../assets/${skin.file}`, import.meta.url).href
                      }
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
                        color: "#ff6f00",
                      }}
                    >
                      {skin.name}
                    </div>
                    {permanent ? (
                      selectedFlower === skin.file ? (
                        <button
                          onClick={handleResetFlower}
                          style={{
                            background: "#eee",
                            color: "#6d4c41",
                            border: "none",
                            borderRadius: 8,
                            padding: "4px 12px",
                            fontWeight: "bold",
                            margin: "0 auto",
                          }}
                        >
                          Снять
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyFlower(skin.file)}
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
                    ) : tempActiveFlower === skin.file ? (
                      <button
                        onClick={() => handleClaimTempFlower(skin.file)}
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
                        Получить
                      </button>
                    ) : (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#bdbdbd",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        Недоступно
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
        {newFlowerUnlock && (
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
              В магазине открылся новый цветок!
            </div>
          </div>
        )}
        {!newFlowerUnlock && newUnlock && (
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
