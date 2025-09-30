import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const GlassMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 50vw;
  max-width: 420px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: -8px 0 32px #6d4c4133;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
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
  position: fixed;
  top: 45%;
  right: 0;
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
  return (
    <>
      <TailIcon
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: open ? '-50vw' : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        onClick={toggleMenu}
        style={{
          right: open ? '40px' : 0,
          zIndex: 200,
        }}
      >
        <TailGrip />
      </TailIcon>
      <GlassMenu
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {showPlantBtn && (
          <MenuButton onClick={onPlant}>Посадить цветок</MenuButton>
        )}
        <MenuButton onClick={onFertilize} disabled={disableActions || !canFertilize} style={{opacity: canFertilize && !disableActions ? 1 : 0.5, pointerEvents: canFertilize && !disableActions ? 'auto' : 'none'}}>
          Удобрить
        </MenuButton>
        <MenuButton onClick={onWater} disabled={disableActions || !canWater} style={{opacity: canWater && !disableActions ? 1 : 0.5, pointerEvents: canWater && !disableActions ? 'auto' : 'none'}}>
          Полить
        </MenuButton>
        <MenuButton
          style={{marginTop: '2.5rem', background:'#ffe082', color:'#6d4c41', fontWeight:700}}
          onClick={() => {
            onShop();
          }}
        >
          Магазин
        </MenuButton>
      </GlassMenu>
    </>
  );
};

export default Menu;
