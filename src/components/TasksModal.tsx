import React, { useEffect, useState } from "react";
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
  overflow: hidden !important;
  overscroll-behavior: contain;
  touch-action: none;
  user-select: none;
  /* Блокируем любые скроллы и перетаскивания */
`;

const Title = styled.h2`
  color: #6d4c41;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  width: 100%;
`;

const TimerText = styled.div`
  font-size: 1.1rem;
  color: #888;
  margin-bottom: 1.2rem;
  text-align: center;
`;

const TaskList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  overflow: hidden !important;
  overscroll-behavior: contain;
  touch-action: none;
  user-select: none;
  /* Блокируем любые скроллы и скроллбары */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TaskItem = styled.div`
  background: rgba(255, 236, 179, 0.98);

  border-radius: 1.2rem;
  box-shadow: 0 2px 8px #a1887f44;
  padding: 1.1rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #6d4c41;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;
`;

const Reward = styled.div`
  color: #ff9800;
  font-weight: bold;
  margin-top: 0.7rem;
  font-size: 1.1rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: -0.9rem;
  right: -1.2rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #6d4c41;
  cursor: pointer;
  z-index: 10;
`;

export const TASKS = [
    { name: "Полить горшок", reward: 10 },
    { name: "Удобрить горшок", reward: 10 },
    { name: "Полить горшок 10 раз", reward: 50 },
    { name: "Удобрить горшок 3 раза", reward: 50 },
    { name: "Зайти в игру", reward: 10 },
    { name: "Удобрить и полить горшок", reward: 20 },
    { name: "Бесплатно", reward: 10 },
    // Новые задания на пробуждение горшка
    { name: "Пробудить горшок", reward: 10 },
    { name: "Пробудить горшок 10 раз", reward: 50 },
    { name: "Пробудить горшок 30 раз", reward: 150 },
];

function getNextUpdateTime() {
  const last = Number(localStorage.getItem("tasks_last_update") || 0);
  return last + 12 * 3600 * 1000;
}

function getTimeLeft(target: number) {
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return "Обновление!";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours}ч ${minutes}м ${seconds}с`;
}

function getRandomTasks() {
  const arr = [...TASKS];
  const result = [];
  for (let i = 0; i < 3; i++) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(arr[idx]);
    arr.splice(idx, 1);
  }
  return result;
}

export interface TasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TasksModal: React.FC<TasksModalProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Array<{ name: string; reward: number }>>(
    []
  );
  const [timer, setTimer] = useState<string>("");

  const [completed, setCompleted] = useState<{ [key: string]: boolean }>({});
  const [claimed, setClaimed] = useState<{ [key: string]: boolean }>({});
  const [showCompleteMsg, setShowCompleteMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let lastUpdate = Number(localStorage.getItem("tasks_last_update") || 0);
    let saved = localStorage.getItem("tasks_current");
    let currentTasks: Array<{ name: string; reward: number }> = [];
    // let claimedObj: { [key: string]: boolean } = {};
    if (!saved || Date.now() - lastUpdate > 12 * 3600 * 1000) {
      currentTasks = getRandomTasks();
      localStorage.setItem("tasks_current", JSON.stringify(currentTasks));
      localStorage.setItem("tasks_last_update", String(Date.now()));
      // Сброс claimed при обновлении заданий
      localStorage.setItem("tasks_claimed", JSON.stringify({}));
    } else {
      try {
        currentTasks = JSON.parse(saved);
      } catch {
        currentTasks = getRandomTasks();
      }
      // Загружаем claimed из localStorage (но не используем claimedObj)
      try {
        JSON.parse(localStorage.getItem("tasks_claimed") || "{}") || {};
      } catch {
        /* пусто */
      }
    }
    setTasks(currentTasks);

    // Функция для обновления прогресса и выполненных заданий
    const updateProgress = () => {
      let savedCompleted = {};
      try {
        savedCompleted =
          JSON.parse(localStorage.getItem("tasks_completed") || "{}") || {};
      } catch {}
      setCompleted(savedCompleted);
      // claimed тоже может меняться (например, после получения награды в другом окне)
      let claimedObj = {};
      try {
        claimedObj =
          JSON.parse(localStorage.getItem("tasks_claimed") || "{}") || {};
      } catch {}
      setClaimed(claimedObj);
    };
    // Таймер для обновления времени до обновления заданий
    const updateTimers = () => {
      const nextUpdate = getNextUpdateTime();
      setTimer(getTimeLeft(nextUpdate));
    };
    updateProgress();
    updateTimers();
    const interval = setInterval(() => {
      updateProgress();
      updateTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;
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
  <CloseBtn onClick={() => { if (typeof window.playClick2 === 'function') window.playClick2(); onClose(); }} title="Закрыть">
          ×
        </CloseBtn>
        <Title>Задания</Title>
        <TimerText>Обновится через: {timer}</TimerText>
        <TaskList>
          {tasks.map((task, idx) => {
            const key = task.name;
            const nkey = key.trim().toLowerCase();
            const isDone = completed[nkey];
            return (
              <TaskItem key={idx}>
                {task.name}
                <Reward>Награда: {task.reward} монет</Reward>
                {isDone && !claimed[nkey] ? (
                  <button
                    style={{
                      marginTop: 10,
                      background: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #43a04744",
                    }}
                    onClick={() => {
                      let coins = Number(
                        localStorage.getItem("progress_coins") || 0
                      );
                      coins += task.reward;
                      localStorage.setItem("progress_coins", String(coins));
                      const newClaimed = { ...claimed, [nkey]: true };
                      setClaimed(newClaimed);
                      localStorage.setItem(
                        "tasks_claimed",
                        JSON.stringify(newClaimed)
                      );
                      setShowCompleteMsg("Вы выполнили задание!");
                      setTimeout(() => setShowCompleteMsg(null), 3000);
                    }}
                  >
                    Получить
                  </button>
                ) : null}
                {isDone && claimed[nkey] ? (
                  <button
                    style={{
                      marginTop: 10,
                      background: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 18px",
                      fontWeight: "bold",
                      opacity: 0.7,
                      cursor: "not-allowed",
                      boxShadow: "0 2px 8px #43a04744",
                    }}
                    disabled
                  >
                    Получено
                  </button>
                ) : null}
              </TaskItem>
            );
          })}
        </TaskList>
        {showCompleteMsg && (
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
              {showCompleteMsg}
            </div>
          </div>
        )}
      </ModalBox>
    </ModalOverlay>
  );
};

export default TasksModal;
