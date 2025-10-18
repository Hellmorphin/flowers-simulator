import React, { useState } from "react";
import styled from "styled-components";
import HowToPlayModal from "./HowToPlayModal";
import SimpleModal from "./SimpleModal";
import AboutProjectModal from "./AboutProjectModal";

const Wrapper = styled.div`
  min-height: 100dvh;
  width: 100%;
  background: #6d4c41;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding-top: 48px;
`;

const BackButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: 72px;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ffb300 0%, #ffecb3 60%, #6d4c41 100%);
  color: #6d4c41;
  font-size: 1.45rem;
  font-weight: bold;
  border: none;
  border-radius: 2.5rem;
  padding: 1.2rem 3.5rem;
  box-shadow: 0 8px 32px #a1887f99, 0 2px 8px #ffb30099;
  cursor: pointer;
  z-index: 100;
  transition: box-shadow 0.2s, background 0.2s;
  &:hover {
    box-shadow: 0 12px 40px #a1887fcc, 0 4px 16px #ffb300cc;
    background: linear-gradient(135deg, #ffecb3 0%, #ffb300 60%, #6d4c41 100%);
  }
`;

const MenuButton = styled.button`
  width: 100%;
  max-width: 340px;
  margin: 18px auto 0 auto;
  display: block;
  background: linear-gradient(135deg, #ffb300 0%, #ffecb3 60%, #6d4c41 100%);
  color: #6d4c41;
  font-size: 1.45rem;
  font-weight: bold;
  border: none;
  border-radius: 2.5rem;
  padding: 1.2rem 3.5rem;
  box-shadow: 0 8px 32px #a1887f99, 0 2px 8px #ffb30099;
  cursor: pointer;
  z-index: 10;
  transition: box-shadow 0.2s, background 0.2s;
  outline: none;
  user-select: none;
  &:focus {
    outline: none;
    box-shadow: 0 8px 32px #a1887f99, 0 2px 8px #ffb30099;
  }
  &:hover {
    box-shadow: 0 12px 40px #a1887fcc, 0 4px 16px #ffb300cc;
    background: linear-gradient(135deg, #ffecb3 0%, #ffb300 60%, #6d4c41 100%);
  }
`;

interface AboutGameScreenProps {
  onBack: () => void;
}

const AboutGameScreen: React.FC<AboutGameScreenProps> = ({ onBack }) => {
  const [howToOpen, setHowToOpen] = useState(false);
  const [modal, setModal] = useState<null | "about" | "creators" | "support">(
    null
  );
  return (
    <Wrapper>
      <MenuButton onClick={() => setHowToOpen(true)}>Как играть?</MenuButton>
      <MenuButton onClick={() => setModal("about")}>О проекте</MenuButton>
      <MenuButton onClick={() => setModal("creators")}>Создатели</MenuButton>
      <MenuButton onClick={() => setModal("support")}>Техподдержка</MenuButton>
      <BackButton onClick={onBack}>Вернуться в меню</BackButton>
      {howToOpen && <HowToPlayModal onClose={() => setHowToOpen(false)} />}
      {modal === "about" && (
        <AboutProjectModal onClose={() => setModal(null)} />
      )}
      {modal === "creators" && (
        <SimpleModal onClose={() => setModal(null)} title="Создатели">
          <div
            style={{
              textAlign: "left",
              lineHeight: 1.7,
              fontSize: "1.13rem",
              maxWidth: 300,
              margin: "0 auto",
            }}
          >
            <b>Разработчик:</b>{" "}
            <span style={{ color: "#d59527" }}>Hellmorphin</span>
            <br />
            <b>Гейм-дизайнер:</b>{" "}
            <span style={{ color: "#d59527" }}>Hellmorphin</span>
            <br />
            <b>Дизайн и UI:</b>{" "}
            <span style={{ color: "#d59527" }}>Hellmorphin</span>
            <br />
          </div>
        </SimpleModal>
      )}
      {modal === "support" && (
        <SimpleModal onClose={() => setModal(null)} title="Техподдержка">
          <div
            style={{
              textAlign: "left",
              lineHeight: 1.7,
              fontSize: "1.13rem",
              maxWidth: 300,
              margin: "0 auto",
            }}
          >
            <b>По всем вопросам и предложениям:</b>
            <br />
            Telegram:{" "}
            <a
              href="https://t.me/Hellmorphin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              @Hellmorphin
            </a>
            <br />
            <span style={{ fontSize: "0.98rem", color: "#6d4c41" }}>
              Пишите в любое время, всегда рады помочь!
            </span>
          </div>
        </SimpleModal>
      )}
    </Wrapper>
  );
};

export default AboutGameScreen;
