
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";


const Background = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: #6d4c41;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: bold;
  color: #ffecb3;
  text-shadow: 0 4px 16px #a1887f, 0 1px 0 #ffb300;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
  z-index: 2;
  margin-left: 10px;
`;

const PotBg = styled(motion.img)`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 340px;
  max-width: 80vw;
  transform: translate(-50%, -50%);
  opacity: 0.25;
  z-index: 1;
  pointer-events: none;
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffb300 0%, #ffecb3 60%, #6d4c41 100%);
  color: #6d4c41;
  font-size: 2rem;
  font-weight: bold;
  border: none;
  border-radius: 2.5rem;
  padding: 1.5rem 4rem;
  box-shadow: 0 8px 32px #a1887f99, 0 2px 8px #ffb30099;
  cursor: pointer;
  margin-top: 2rem;
  transition: box-shadow 0.2s;
  z-index: 2;
  &:hover {
    box-shadow: 0 12px 40px #a1887fcc, 0 4px 16px #ffb300cc;
    background: linear-gradient(135deg, #ffecb3 0%, #ffb300 60%, #6d4c41 100%);
  }
`;

type StartScreenProps = {
  onStart: () => void;
  onAbout: () => void;
};


const AboutButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffb300 0%, #ffecb3 60%, #6d4c41 100%);
  color: #6d4c41;
  font-size: 1.45rem;
  font-weight: bold;
  border: none;
  border-radius: 2.5rem;
  padding: 1.2rem 3.5rem;
  margin-top: 40px;
  box-shadow: 0 8px 32px #a1887f99, 0 2px 8px #ffb30099;
  cursor: pointer;
  z-index: 2;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    box-shadow: 0 12px 40px #a1887fcc, 0 4px 16px #ffb300cc;
    background: linear-gradient(135deg, #ffecb3 0%, #ffb300 60%, #6d4c41 100%);
  }
`;

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onAbout }) => {
  const handleClick = () => {
    const audio = new Audio(new URL("../assets/Click.mp3", import.meta.url).href);
    audio.currentTime = 0;
    audio.play().catch(() => {});
    onStart();
  };
  const nickname = localStorage.getItem('flowersim.user');
  return (
    <Background>
      <PotBg
        src={new URL("../assets/gorshok.jpg", import.meta.url).href}
        alt="Горшок"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <Title
        initial={{ scale: 0.8, y: -40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        Gorshock
      </Title>
      {nickname && (
        <div style={{
          marginBottom: 12,
          background: '#fffde7',
          color: '#6d4c41',
          fontWeight: 700,
          fontSize: 20,
          borderRadius: 12,
          padding: '6px 24px',
          boxShadow: '0 2px 8px #ffb30022',
          textAlign: 'center',
          minWidth: 100,
          maxWidth: '80vw',
        }}>
          {nickname}
        </div>
      )}
      <StartButton
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleClick}
      >
        Начать
      </StartButton>
      <AboutButton
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.04 }}
        onClick={onAbout}
      >
        Об игре
      </AboutButton>
    </Background>
  );
}

export default StartScreen;
