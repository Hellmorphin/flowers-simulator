// Инициализация заданий при первом запуске
import { TASKS } from "./components/TasksModal";
import React, { useState, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import MainScreen from "./components/MainScreen";
import Menu from "./components/Menu";
import Tutorial from "./components/Tutorial";
import ToastManager, { ToastManagerContext } from "./components/ToastManager";

const FLOWER_KEY = "flowersim.progress";

interface Progress {
  flowerSize: number; // px (deprecated)
  flowerSizes: { [skin: string]: number };
  lastWater: number;
  lastFertilize: number;
  tutorialStep: number;
}

const MIN_FLOWER = 32;
const MAX_FLOWER = 380;
const defaultProgress: Progress = {
  flowerSize: MIN_FLOWER,
  flowerSizes: { "Flowers1.png": MIN_FLOWER },
  lastWater: 0,
  lastFertilize: 0,
  tutorialStep: 0,
};

// Туториал: 0 — открыть меню, 1 — посадить цветок, 2 — открыть меню, 3 — удобрить, 4 — полить
const TUTORIAL_STEPS = [
  "Нажмите на хвостик справа для открытия меню.",
  "Нажмите «Посадить цветок».",
  "Обратите внимание на кнопку с удобрением и каплей.",
  "Нажмите «Удобрить».",
  "Нажмите «Полить».",
];

import ShopModal from "./components/ShopModal";
import TasksModal from "./components/TasksModal";
import ProgressModal from "./components/ProgressModal";
import BackgroundModal from "./components/BackgroundModal";

function App() {
  // Инициализация заданий при первом запуске приложения
  useEffect(() => {
    const saved = localStorage.getItem("tasks_current");
    const lastUpdate = Number(localStorage.getItem("tasks_last_update") || 0);
    const now = Date.now();
    if (!saved || now - lastUpdate > 12 * 3600 * 1000) {
      // Случайные 3 задания
      const shuffled = [...TASKS].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      localStorage.setItem("tasks_current", JSON.stringify(selected));
      localStorage.setItem("tasks_last_update", now.toString());
      localStorage.setItem("tasks_completed", "{}");
      localStorage.setItem("tasks_claimed", "{}");
      localStorage.setItem("tasks_progress", "{}");
    }
  }, []);
  // --- Задания ---
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  // Проверка и обновление прогресса задания
  function updateTaskProgress(type: string) {
    let progress: Record<string, number> = {};
    let completed: Record<string, boolean> = {};
    try {
      const rawProgress =
        JSON.parse(localStorage.getItem("tasks_progress") || "{}") || {};
      const rawCompleted =
        JSON.parse(localStorage.getItem("tasks_completed") || "{}") || {};
      // Если вдруг в localStorage оказался не объект, сбрасываем
      if (
        typeof rawProgress === "object" &&
        rawProgress !== null &&
        !Array.isArray(rawProgress)
      ) {
        progress = rawProgress;
      }
      if (
        typeof rawCompleted === "object" &&
        rawCompleted !== null &&
        !Array.isArray(rawCompleted)
      ) {
        completed = rawCompleted;
      }
    } catch {
      progress = {};
      completed = {};
    }
    const tasks = JSON.parse(localStorage.getItem("tasks_current") || "[]");
    // Хелпер для нормализации названия (убрать пробелы и регистр)
    const norm = (s: string) => s.trim().toLowerCase();
    // Используем нормализованные ключи для хранения прогресса и завершения
    let progressNorm: Record<string, number> = {};
    let completedNorm: Record<string, boolean> = {};
    // Переносим старые значения в новые нормализованные ключи (однократно)
    Object.keys(progress).forEach((k) => {
      progressNorm[norm(k)] = progress[k];
    });
    Object.keys(completed).forEach((k) => {
      completedNorm[norm(k)] = completed[k];
    });
    tasks.forEach((task: any) => {
      const key = task.name;
      const nkey = norm(key);
      // Сравниваем нормализованные названия
      if (nkey === norm("полить горшок") && type === "water")
        completedNorm[nkey] = true;
      if (nkey === norm("удобрить горшок") && type === "fertilize")
        completedNorm[nkey] = true;
      if (nkey === norm("полить горшок 10 раз") && type === "water") {
        progressNorm[nkey] = (progressNorm[nkey] ?? 0) + 1;
        if (progressNorm[nkey] >= 10) completedNorm[nkey] = true;
      }
      if (nkey === norm("удобрить горшок 3 раза") && type === "fertilize") {
        progressNorm[nkey] = (progressNorm[nkey] ?? 0) + 1;
        if (progressNorm[nkey] >= 3) completedNorm[nkey] = true;
      }
      if (nkey === norm("удобрить и полить горшок")) {
        // 1 — был полив, 2 — было удобрение, 3 — оба действия
        let val = progressNorm[nkey] ?? 0;
        if (type === "water") val = val | 1;
        if (type === "fertilize") val = val | 2;
        progressNorm[nkey] = val;
        if (val === 3) completedNorm[nkey] = true;
      }
    });
    // Сохраняем только нормализованные ключи
    localStorage.setItem("tasks_progress", JSON.stringify(progressNorm));
    localStorage.setItem("tasks_completed", JSON.stringify(completedNorm));
  }

  // Зайти в игру / Бесплатно
  // tasksModalOpen должен быть объявлен выше
  // (оставляем только одно объявление выше)
  // ...existing code...
  useEffect(() => {
    if (!tasksModalOpen) return;
    let completed: Record<string, boolean> = {};
    try {
      completed =
        JSON.parse(localStorage.getItem("tasks_completed") || "{}") || {};
    } catch {}
    const norm = (s: string) => s.trim().toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks_current") || "[]");
    let changed = false;
    tasks.forEach((task: any) => {
      const nkey = norm(task.name);
      if (nkey === norm("Зайти в игру") || nkey === norm("Бесплатно")) {
        if (!completed[nkey]) {
          completed[nkey] = true;
          changed = true;
        }
      }
    });
    if (changed)
      localStorage.setItem("tasks_completed", JSON.stringify(completed));
  }, [tasksModalOpen]);
  // удалено повторное объявление
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem(FLOWER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Миграция: если flowerSizes нет, создать и перенести размер
      if (!parsed.flowerSizes) {
        parsed.flowerSizes = {
          [localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png"]:
            parsed.flowerSize || 80,
        };
      }
      return parsed;
    }
    return defaultProgress;
  });
  // Получаем текущий скин цветка
  const flowerSkin =
    localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
  // Размер для текущего цветка
  const currentFlowerSize = progress.flowerSizes[flowerSkin] ?? MIN_FLOWER;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    () => progress.tutorialStep < 5
  );
  const [toastApi, setToastApi] = useState<any>(null);

  // Сохраняем прогресс
  useEffect(() => {
    localStorage.setItem(FLOWER_KEY, JSON.stringify(progress));
  }, [progress]);

  // Для ToastManager
  const toastContext = React.useContext(ToastManagerContext);
  useEffect(() => {
    if (toastContext) setToastApi(toastContext);
  }, [toastContext]);

  // Проверка времени для полива/удобрения
  const now = Date.now();
  const canWater = now - progress.lastWater > 30 * 60 * 1000;
  const canFertilize = now - progress.lastFertilize > 2 * 60 * 60 * 1000;

  // Туториал логика
  const [tutorialStep, setTutorialStep] = useState<number>(
    progress.tutorialStep
  );
  const [showFinalHint, setShowFinalHint] = useState(() => {
    // Принудительно скрываем финальный туториал у старых пользователей
    if (progress.tutorialStep >= 5) return false;
    return (
      localStorage.getItem("flowersim.finalHintShown") !== "1" &&
      progress.tutorialStep >= 5
    );
  });
  const [finalHintTimeout, setFinalHintTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [mainBg, setMainBg] = useState<string | null>(
    localStorage.getItem("flowersim.bg")
  );
  // Слушаем события открытия модалок
  useEffect(() => {
    const handlerProgress = () => {
      setProgressModalOpen(true);
      setMenuOpen(false);
    };
    const handlerBg = () => {
      setBackgroundModalOpen(true);
      setMenuOpen(false);
    };
    window.addEventListener("openProgressModal", handlerProgress);
    window.addEventListener("openBackgroundModal", handlerBg);
    const handlerTasks = () => {
      setTasksModalOpen(true);
      setMenuOpen(false);
    };
    window.addEventListener("openTasksModal", handlerTasks);
    return () => {
      window.removeEventListener("openProgressModal", handlerProgress);
      window.removeEventListener("openBackgroundModal", handlerBg);
    };
  }, []);

  // Сбросить туториал если новый пользователь
  useEffect(() => {
    if (progress.tutorialStep < 5) setShowTutorial(true);
    else setShowTutorial(false);
  }, [progress.tutorialStep]);

  // Шаг 0: открыть меню
  useEffect(() => {
    if (!started) return;
    if (tutorialStep === 0 && menuOpen) {
      setTutorialStep(1);
      setProgress((p) => ({ ...p, tutorialStep: 1 }));
    }
  }, [tutorialStep, menuOpen, started]);

  // Шаг 1: посадить цветок
  const handlePlant = () => {
    setProgress((p) => ({
      ...p,
      flowerSizes: { ...p.flowerSizes, [flowerSkin]: MIN_FLOWER },
      tutorialStep: 2,
    }));
    setTutorialStep(2);
    setMenuOpen(false);
  };

  // Шаг 2: показать подсказку и автоматически перейти к следующему шагу через 3 секунды
  useEffect(() => {
    if (tutorialStep === 2) {
      const timeout = setTimeout(() => {
        setTutorialStep(3);
        setProgress((p) => ({ ...p, tutorialStep: 3 }));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [tutorialStep]);

  // Анимации лейки и удобрения
  const [showLeika, setShowLeika] = useState(false);
  const [showYdobr, setShowYdobr] = useState(false);

  // Шаг 3: удобрить
  const handleFertilize = () => {
    if (!canFertilize) return;
    setShowYdobr(true);
    setTimeout(() => setShowYdobr(false), 4000);
    // Только для новых пользователей продолжаем туториал
    if (progress.tutorialStep < 5) {
      setProgress((p) => {
        const newP = {
          ...p,
          lastFertilize: now,
          flowerSizes: {
            ...p.flowerSizes,
            [flowerSkin]: Math.min(
              MAX_FLOWER,
              (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 10
            ),
          },
          tutorialStep: 4,
        };
        setTimeout(() => updateTaskProgress("fertilize"), 0);
        return newP;
      });
      setTutorialStep(4);
    } else {
      setProgress((p) => {
        const newP = {
          ...p,
          lastFertilize: now,
          flowerSizes: {
            ...p.flowerSizes,
            [flowerSkin]: Math.min(
              MAX_FLOWER,
              (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 2
            ),
          },
        };
        setTimeout(() => updateTaskProgress("fertilize"), 0);
        return newP;
      });
    }
    setMenuOpen(false);
    toastApi?.showToast("Удобрено!");
  };

  // Шаг 4: полить
  const handleWater = () => {
    if (!canWater) return;
    setShowLeika(true);
    setTimeout(() => setShowLeika(false), 4000);
    const size = progress.flowerSizes[flowerSkin] || MIN_FLOWER;
    if (size >= MAX_FLOWER) {
      (toastApi?.showToast || toastContext?.showToast)?.(
        "Цветок Вырос до максимума!"
      );
      setMenuOpen(false);
      return;
    }
    setProgress((p) => {
      const newP = {
        ...p,
        lastWater: now,
        flowerSizes: {
          ...p.flowerSizes,
          [flowerSkin]: Math.min(
            MAX_FLOWER,
            (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 5
          ),
        },
        tutorialStep: 5,
      };
      setTimeout(() => updateTaskProgress("water"), 0);
      return newP;
    });
    setTutorialStep(5);
    setMenuOpen(false);
    toastApi?.showToast("Спасибо!");
    setTimeout(() => setShowFinalHint(true), 800);
  };

  // После завершения туториала скрываем его и показываем уведомление на 15 секунд
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (
      tutorialStep >= 5 &&
      localStorage.getItem("flowersim.finalHintShown") !== "1"
    ) {
      setShowTutorial(false);
      setShowFinalHint(true);
      if (finalHintTimeout) clearTimeout(finalHintTimeout);
      timeout = setTimeout(() => {
        setShowFinalHint(false);
        localStorage.setItem("flowersim.finalHintShown", "1");
      }, 10000);
      setFinalHintTimeout(timeout);
    } else {
      setShowFinalHint(false);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      if (finalHintTimeout) clearTimeout(finalHintTimeout);
    };
    // eslint-disable-next-line
  }, [tutorialStep, progress.tutorialStep]);

  // Для StartScreen
  const handleStart = () => setStarted(true);

  // Для туториала
  const tutorialText =
    progress.tutorialStep >= 5 ? "" : TUTORIAL_STEPS[tutorialStep] || "";

  return (
    <ToastManager>
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <>
          {progress.tutorialStep < 5 &&
            showFinalHint &&
            localStorage.getItem("flowersim.finalHintShown") !== "1" && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  background: "rgba(255,236,179,0.98)",
                  color: "#6d4c41",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  zIndex: 9999,
                  padding: "0.7rem 0",
                  boxShadow: "0 2px 16px #a1887f44",
                }}
              >
                Не забывай поливать цветок каждый час и удобрять каждые 3 часа
                игрового времени чтобы вырастить его.
              </div>
            )}
          <MainScreen
            flowerSize={currentFlowerSize}
            flowerVisible={
              progress.tutorialStep > 1 && currentFlowerSize > MIN_FLOWER - 1
            }
            potSkin={localStorage.getItem("flowersim.potSkin") || "gorshok.jpg"}
            mainBg={mainBg}
            showLeika={showLeika}
            showYdobr={showYdobr}
            onPlant={handlePlant}
            onWater={handleWater}
            onFertilize={handleFertilize}
            canWater={canWater}
            canFertilize={canFertilize}
            disableActions={tutorialStep < 2}
          />
          <Menu
            open={menuOpen}
            toggleMenu={() => setMenuOpen((v) => !v)}
            onPlant={handlePlant}
            onWater={handleWater}
            onFertilize={handleFertilize}
            canWater={canWater}
            canFertilize={canFertilize}
            tutorialStep={tutorialStep}
            onShop={() => {
              setShopOpen(true);
              setMenuOpen(false);
            }}
            isFlowerMaxed={currentFlowerSize >= MAX_FLOWER}
          />
          {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
          {progressModalOpen && (
            <ProgressModal
              isOpen={progressModalOpen}
              onClose={() => setProgressModalOpen(false)}
            />
          )}
          {backgroundModalOpen && (
            <BackgroundModal
              isOpen={backgroundModalOpen}
              onClose={() => setBackgroundModalOpen(false)}
              onApply={(bg) => {
                setMainBg(bg);
              }}
              currentBg={mainBg}
            />
          )}
          <Tutorial
            visible={showTutorial && tutorialStep < 5}
            text={tutorialText}
            step={tutorialStep}
            menuOpen={menuOpen}
            topBar
          />
          {tasksModalOpen && (
            <TasksModal
              isOpen={tasksModalOpen}
              onClose={() => setTasksModalOpen(false)}
            />
          )}
        </>
      )}
    </ToastManager>
  );
}

export default App;
