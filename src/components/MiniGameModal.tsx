import React from "react";
import styled from "styled-components";
import { GiDinosaurRex } from "react-icons/gi";
import { motion } from "framer-motion";

import { GiHammerDrop } from "react-icons/gi";
import { FaMousePointer, FaCoins } from "react-icons/fa";
import { GiFlowerPot } from "react-icons/gi";
import { FaFeatherAlt } from "react-icons/fa";
import { GiFalling } from "react-icons/gi";
import { FaHandHolding } from "react-icons/fa";

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
  max-width: 420px;
  min-height: 150px;
  max-height: 90dvh;
  padding: 2rem 2vw 2rem 2vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const GamesScrollArea = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
    display: none;
  }
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  width: 100%;
`;

const Block = styled.div`
  background: rgba(255, 236, 179, 0.98);
  border-radius: 1rem;
  box-shadow: 0 2px 8px #ffb30044;
  padding: 1.2rem 1.7rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6f00;
  margin-bottom: 0.7rem;
`;

const GameDescription = styled.div`
  font-size: 1rem;
  color: #6d4c41;
  text-align: center;
  margin-bottom: 1rem;
  white-space: pre-line;
  word-break: break-word;
`;

const PlayButton = styled.button`
  background: #000000;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 48px;
  font-size: 1.1em;
  font-weight: bold;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
  min-width: 160px;
  &:hover:enabled {
    background: #ffa000;
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

export type MiniGameModalProps = {
  clickerCooldown: number;
  fallingCooldown: number;
  dinoCooldown: number;
  onPlay: (game: "clicker" | "falling" | "hitpot" | "dino" | "flappy") => void;
  onClose: () => void;
};

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  clickerCooldown,
  fallingCooldown,
  dinoCooldown,
  onPlay,
  onClose,
}) => {
  const [hitpotCooldown, setHitpotCooldown] = React.useState(() => {
    const t = Number(localStorage.getItem("hitpotGameCooldown") || 0);
    return Math.max(0, t - Date.now());
  });
  const [hitpotBought, setHitpotBought] = React.useState(
    () => localStorage.getItem("hitpotGameBought") === "1"
  );
  const [coins, setCoins] = React.useState(() =>
    Number(localStorage.getItem("progress_coins") || 0)
  );
  const [fallingBought, setFallingBought] = React.useState(
    () => localStorage.getItem("fallingGameBought") === "1"
  );
  const [dinoBought, setDinoBought] = React.useState(
    () => localStorage.getItem("dinoGameBought") === "1"
  );
  const [flappyBought, setFlappyBought] = React.useState(
    () => localStorage.getItem("flappyGameBought") === "1"
  );
  const handleBuyFlappy = () => {
    if (coins >= 1000 && !flappyBought) {
      setCoins(coins - 1000);
      localStorage.setItem("progress_coins", String(coins - 1000));
      setFlappyBought(true);
      localStorage.setItem("flappyGameBought", "1");
    }
  };
  // РџРѕРєСѓРїРєР° РјРёРЅРё-РёРіСЂС‹ 'Р›РѕРІРµС† РіРѕСЂС€РєРѕРІ'
  const handleBuyFalling = () => {
    if (coins >= 500 && !fallingBought) {
      setCoins(coins - 500);
      localStorage.setItem("progress_coins", String(coins - 500));
      setFallingBought(true);
      localStorage.setItem("fallingGameBought", "1");
    }
  };
  const handleBuyDino = () => {
    if (coins >= 1000 && !dinoBought) {
      setCoins(coins - 1000);
      localStorage.setItem("progress_coins", String(coins - 1000));
      setDinoBought(true);
      localStorage.setItem("dinoGameBought", "1");
    }
  };
  React.useEffect(() => {
    const handler = () => {
      setCoins(Number(localStorage.getItem("progress_coins") || 0));
      setHitpotBought(localStorage.getItem("hitpotGameBought") === "1");
      const t = Number(localStorage.getItem("hitpotGameCooldown") || 0);
      setHitpotCooldown(Math.max(0, t - Date.now()));
      setFallingBought(localStorage.getItem("fallingGameBought") === "1");
      setFlappyBought(localStorage.getItem("flappyGameBought") === "1");
    };
    window.addEventListener("storage", handler);
    const interval = setInterval(handler, 1000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // --- С„СѓРЅРєС†РёСЏ РґР»СЏ Р·Р°РїСѓСЃРєР° РёРіСЂС‹ Рё СѓСЃС‚Р°РЅРѕРІРєРё РљР” ---
  function handlePlayHitpot() {
    onPlay("hitpot");
    // СЃР»СѓС€Р°РµРј Р·Р°РІРµСЂС€РµРЅРёРµ РёРіСЂС‹ С‡РµСЂРµР· window event
    window.addEventListener(
      "hitpotGameResult",
      (e: any) => {
        if (e.detail === "win") {
          const next = Date.now() + 5 * 60 * 1000; // 5 РјРёРЅСѓС‚
          localStorage.setItem("hitpotGameCooldown", String(next));
          setHitpotCooldown(5 * 60 * 1000);
        } else if (e.detail === "lose") {
          const next = Date.now() + 3 * 60 * 1000; // 3 РјРёРЅСѓС‚С‹
          localStorage.setItem("hitpotGameCooldown", String(next));
          setHitpotCooldown(3 * 60 * 1000);
        }
      },
      { once: true }
    );
  }

  function getTimeLeftText(ms: number) {
    if (ms <= 0) return "";
    const min = Math.ceil(ms / 60000);
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0) return `${m}м`;
    return `${m}м`;
  }
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
        <CloseBtn onClick={onClose}>&times;</CloseBtn>
        <Title>Мини-игры</Title>

        <GamesScrollArea>
          <Block>
            <GameName>Кликер мания</GameName>
            <div>
              <FaMousePointer
                style={{ color: "#00bcd4", fontSize: 28, marginRight: 6 }}
              />
              <FaCoins style={{ color: "#ffc107", fontSize: 28 }} />
            </div>
            <GameDescription>{`За 15 секунд нужно накликать как\nможно больше монет.`}</GameDescription>
            {clickerCooldown > 0 ? (
              <PlayButton disabled>
                {getTimeLeftText(clickerCooldown)}
              </PlayButton>
            ) : (
              <PlayButton onClick={() => onPlay("clicker")}>Играть</PlayButton>
            )}
          </Block>
          <Block>
            <GameName>Динозаврик</GameName>
            <GiDinosaurRex style={{ color: "#4caf50", fontSize: 32 }} />

            <GameDescription>{`Беги и уворачивайся от кактусов.
Скорость растет, успевай прыгать.`}</GameDescription>
            {!dinoBought ? (
              <PlayButton disabled={coins < 1000} onClick={handleBuyDino}>
                <FaCoins
                  style={{ marginRight: 6, marginBottom: -3, color: "#ffb300" }}
                />
                1000
              </PlayButton>
            ) : (
              <PlayButton onClick={() => onPlay("dino")}>Играть</PlayButton>
            )}
          </Block>
          <Block>
            <GameName>Летающий горшок</GameName>
            <div>
              <GiFlowerPot
                style={{ color: "#8b4513", fontSize: 28, marginRight: 6 }}
              />
              <FaFeatherAlt style={{ color: "#00bfff", fontSize: 24 }} />
            </div>

            <GameDescription>{`Перелетай через трубы!
Вместо птицы - горшок.`}</GameDescription>

            {!flappyBought ? (
              <PlayButton disabled={coins < 1000} onClick={handleBuyFlappy}>
                <FaCoins
                  style={{ marginRight: 6, marginBottom: -3, color: "#ffb300" }}
                />
                1000
              </PlayButton>
            ) : (
              <PlayButton onClick={() => onPlay("flappy")}>Играть</PlayButton>
            )}
          </Block>
          <Block>
            <GameName>Ловец горшков</GameName>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GiFalling style={{ color: "#00bcd4", fontSize: 22 }} />
              <GiFlowerPot style={{ color: "#8b4513", fontSize: 30 }} />
              <FaHandHolding
                style={{ color: "#ffaa00", fontSize: 26, marginTop: 4 }}
              />
            </div>
            <GameDescription>{`Лови падающие горшки 60 секунд,
За каждый пойманный горшок
1 монета.`}</GameDescription>

            {!fallingBought ? (
              <PlayButton disabled={coins < 500} onClick={handleBuyFalling}>
                <FaCoins
                  style={{ marginRight: 6, marginBottom: -3, color: "#ffb300" }}
                />
                500
              </PlayButton>
            ) : fallingCooldown > 0 ? (
              <PlayButton disabled>
                {getTimeLeftText(fallingCooldown)}
              </PlayButton>
            ) : (
              <PlayButton onClick={() => onPlay("falling")}>Играть</PlayButton>
            )}
          </Block>
          <Block>
            <GameName>Ударь горшок</GameName>
            <GiHammerDrop style={{ color: "#655920", fontSize: 30 }} />

            <GameDescription>{`Бей по появляющимся горшкам!
Если пропустишь 3 проигрыш.
1 горшок - 2 монеты`}</GameDescription>

            {!hitpotBought ? (
              <PlayButton
                disabled={coins < 500}
                onClick={() => {
                  if (coins >= 500) {
                    localStorage.setItem("progress_coins", String(coins - 500));
                    localStorage.setItem("hitpotGameBought", "1");
                    setCoins(coins - 500);
                    setHitpotBought(true);
                  }
                }}
              >
                <FaCoins
                  style={{ marginRight: 6, marginBottom: -3, color: "#ffb300" }}
                />
                500
              </PlayButton>
            ) : hitpotCooldown > 0 ? (
              <PlayButton disabled>
                {getTimeLeftText(hitpotCooldown)}
              </PlayButton>
            ) : (
              <PlayButton onClick={handlePlayHitpot}>Играть</PlayButton>
            )}
          </Block>
        </GamesScrollArea>
      </ModalBox>
    </ModalOverlay>
  );
};
