import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaMusic, FaVolumeMute } from "react-icons/fa";

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
  max-width: 400px;
  min-width: 320px;
  min-height: 220px;
  padding: 2rem 2vw 1.5rem 2vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  outline: none;
  box-shadow: none;
  &:focus {
    outline: none;
    box-shadow: none;
  }
  @media (max-width: 700px) {
    top: -0.9rem;
    right: -0.9rem;
  }
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.3rem;
  margin: 0 0 1.2rem 0;
  text-align: center;
  width: 100%;
`;

const MusicModal: React.FC<{
  enabled: boolean;
  volume: number;
  onClose: () => void;
  onToggle: () => void;
  onVolumeChange: (v: number) => void;
}> = ({ enabled, volume, onClose, onToggle, onVolumeChange }) => {
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
        <CloseBtn onClick={onClose} title="Закрыть">
          ×
        </CloseBtn>
        <Title>Музыка</Title>
        <button
          style={{
            background: "none",
            border: "none",
            borderRadius: 12,
            padding: 0,
            marginBottom: 18,
            cursor: "pointer",
            fontWeight: 600,
            color: enabled ? "#ff9800" : "#6d4c41",
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
            boxShadow: "none",
          }}
          onClick={onToggle}
          aria-label={enabled ? "Выключить музыку" : "Включить музыку"}
          tabIndex={0}
          onFocus={(e) => (e.target.style.outline = "none")}
        >
          {enabled ? <FaMusic size={32} /> : <FaVolumeMute size={32} />}
        </button>
        {enabled && (
          <div style={{ width: "100%", marginTop: 10 }}>
            <div
              style={{
                textAlign: "center",
                color: "orange",
                fontWeight: 600,
                fontSize: "1.1rem",
                marginBottom: 6,
              }}
            >
              Громкость
            </div>
            <input
              type="range"
              min={0}
              max={0.1}
              step={0.001}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              style={{ width: "100%", marginTop: 8 }}
            />
          </div>
        )}
      </ModalBox>
    </ModalOverlay>
  );
};

export default MusicModal;
