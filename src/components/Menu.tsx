import React from "react";
import styled from "styled-components";
// Определяем Android-устройство
const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
import { motion } from "framer-motion";

const GlassMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 60vw;
  max-width: 520px;
  height: 100dvh;
  max-width: 100vw;
  max-height: 100dvh;
  background: #6d4c41;
  box-shadow: -8px 0 32px #6d4c4133;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 700px) {
    width: 90vw;
    max-width: 98vw;
    height: 100dvh;
    max-height: 100dvh;
    padding: 0 6vw;
    scrollbar-width: none;
  }
  @media (max-width: 700px) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MenuButton = styled(motion.button)`
  background: rgba(255, 236, 179, 0.8);
  color: #6d4c41;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 1.5rem;
  padding: 1.2rem 2.5rem;
  margin: 1.2rem 0;
  width: 80%;
  max-width: 320px;
  box-shadow: 0 2px 8px #a1887f44;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  &:hover {
    background: #ffecb3;
  }
`;

const TailIcon = styled(motion.div)`
  position: absolute;
  top: 45%;
  left: -38px;
  transform: translateY(-50%);
  width: 38px;
  height: 100px;
  background: linear-gradient(90deg, #ffecb3 60%, #ffb300 100%);
  border-radius: 24px 0 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: -2px 0 8px #a1887f44;
  z-index: 101;
  cursor: pointer;
  border: 2px solid #ffb300;
  @media (max-width: 700px) {
    position: fixed;
    left: auto;
    right: 0;
    top: 45%;
    transform: translateY(-50%);
  }
`;

const TailGrip = styled.div`
  width: 10px;
  height: 48px;
  margin-left: 8px;
  border-radius: 8px;
  background: repeating-linear-gradient(90deg, #6d4c41 0 2px, #ffecb3 2px 6px);
`;

interface MenuProps {
  open: boolean;
  toggleMenu: () => void;
  onPlant: () => void;
  onWater: () => void;
  onFertilize: () => void;
  canWater: boolean;
  canFertilize: boolean;
  tutorialStep?: number;
  onShop: () => void;
}

const Menu: React.FC<MenuProps> = ({
  open,
  toggleMenu,
  onPlant,
  onWater,
  onFertilize,
  canWater,
  canFertilize,
  tutorialStep,
  onShop,
}) => {
  const showPlantBtn = tutorialStep === 1;
  const disableActions = tutorialStep !== undefined && tutorialStep < 2;
  const handleOpenBackgroundModal = () => {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("openBackgroundModal"));
    }
  };
  return (
    <>
      {!open && (
        <TailIcon
          style={{
            position: "fixed",
            right: 0,
            left: "auto",
            top: "45%",
            zIndex: 200,
          }}
          initial={{ x: isAndroid ? 0 : 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={isAndroid ? { duration: 0 } : { type: "spring", stiffness: 120 }}
          onClick={toggleMenu}
        >
          <TailGrip />
        </TailIcon>
      )}
      {open && (
        <GlassMenu
          initial={{ x: isAndroid ? 0 : "100%" }}
          animate={{ x: 0 }}
          transition={isAndroid ? { duration: 0 } : { type: "spring", stiffness: 120 }}
          style={{
            pointerEvents: "auto",
            position: "fixed",
            top: 0,
            right: 0,
          }}
        >
          <TailIcon
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={isAndroid ? { duration: 0 } : { type: "spring", stiffness: 120 }}
            onClick={toggleMenu}
          >
            <TailGrip />
          </TailIcon>
          {showPlantBtn && (
            <MenuButton onClick={onPlant}>Посадить цветок</MenuButton>
          )}
          <MenuButton
            onClick={onFertilize}
            disabled={disableActions || !canFertilize}
            style={{
              opacity: canFertilize && !disableActions ? 1 : 0.5,
              pointerEvents: canFertilize && !disableActions ? "auto" : "none",
            }}
          >
            Удобрить
          </MenuButton>
          <MenuButton
            onClick={onWater}
            disabled={disableActions || !canWater}
            style={{
              opacity: canWater && !disableActions ? 1 : 0.5,
              pointerEvents: canWater && !disableActions ? "auto" : "none",
            }}
          >
            Полить
          </MenuButton>
          <MenuButton
            style={{
              marginTop: "2.5rem",
              background: "#ffe082",
              color: "#6d4c41",
              fontWeight: 700,
            }}
            onClick={() => {
              onShop();
            }}
          >
            Магазин
          </MenuButton>
          <MenuButton
            style={{
              background: "#ffd600",
              color: "#222",
              fontWeight: 700,
              marginTop: "1rem",
            }}
            onClick={() => {
              if (typeof window !== "undefined" && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent("openProgressModal"));
              }
            }}
          >
            Прогресс
          </MenuButton>
          <MenuButton
            style={{
              background: "#ffe082",
              color: "#6d4c41",
              fontWeight: 700,
              marginTop: "1rem",
            }}
            onClick={handleOpenBackgroundModal}
          >
            Фон
          </MenuButton>
        </GlassMenu>
      )}
    </>
  );
};

export default Menu;
