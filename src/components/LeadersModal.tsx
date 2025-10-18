import { API_BASE } from "../apiBase.ts";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCrown } from "react-icons/fa";

interface Player {
  nickname: string;
  coins: number;
  flowersGrown: number;
}

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
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px #6d4c4133;
  max-width: 600px;
  padding: 2.5rem 5px 2rem 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseBtn = styled.button`
  position: absolute;
  background: none;
  border: none;
  font-size: 1.9rem;
  color: #6d4c41;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
  top: 1.2rem;
  right: 1.2rem;
  z-index: 10;
  @media (max-width: 700px) {
    top: -0.9rem;
    right: -0.9rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  text-align: center;
  color: #2d1b09;

  th,
  td {
    padding: 8px;
    color: #2d1b09;
  }

  thead tr {
    background: #ffe082;
    font-weight: bold;
    color: #2d1b09;
  }
`;

const LeadersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [mode, setMode] = useState<"coins" | "flowers">("coins");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE}/top-${mode}`)
      .then((r) => r.json())
      .then((data) => setPlayers(data.top))
      .catch(() => setPlayers([]));
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const getRowColor = (index: number) => {
    switch (index) {
      case 0:
        return "#FFD700";
      case 1:
        return "#C0C0C0";
      case 2:
        return "#CD7F32";
      default:
        return "#6e6b6b";
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // если клик был по фону, а не по модалке
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalBox>
        <CloseBtn onClick={onClose} title="Закрыть">
          ×
        </CloseBtn>

        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "#6d4c41",
            fontWeight: "bold",
          }}
        >
          <FaCrown style={{ color: "#FFD700", fontSize: 28 }} /> Лидеры
        </h2>

        <div
          style={{
            margin: "1rem 0",
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            style={{
              padding: "0.5rem 1.2rem",
              background: mode === "coins" ? "#FFD700" : "#6d4c41",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
              color: "#ff9800",
            }}
            onClick={() => setMode("coins")}
          >
            Топ по монетам
          </button>
          <button
            style={{
              padding: "0.5rem 1.2rem",
              background: mode === "flowers" ? "#FFD700" : "#6d4c41",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
              color: "#ff9800",
            }}
            onClick={() => setMode("flowers")}
          >
            Топ по цветкам
          </button>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Место</th>
              <th>Ник</th>
              {mode === "coins" ? <th>Монеты</th> : <th>Цветов</th>}
            </tr>
          </thead>
          <tbody>
            {players.slice(0, 5).map((p, i) => (
              <tr
                key={p.nickname}
                style={{
                  background: getRowColor(i),
                  fontWeight: i < 3 ? "bold" : "normal",
                  color: "#2d1b09",
                }}
              >
                <td style={{ color: "#2d1b09" }}>{i + 1}</td>
                <td style={{ color: "#2d1b09" }}>{p.nickname}</td>
                {mode === "coins" ? (
                  <td style={{ color: "#2d1b09" }}>{p.coins}</td>
                ) : (
                  <td style={{ color: "#2d1b09" }}>{p.flowersGrown}</td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBox>
    </ModalOverlay>
  );
};

export default LeadersModal;
