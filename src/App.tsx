import { API_BASE } from "./apiBase.ts";
// Инициализация заданий при первом запуске
import { TASKS } from "./components/TasksModal";
import React, { useState, useEffect, useRef } from "react";
import StartScreen from "./components/StartScreen";
import AboutGameScreen from "./components/AboutGameScreen";
import MainScreen from "./components/MainScreen";
import Menu from "./components/Menu";
import Tutorial from "./components/Tutorial";
import ToastManager, { ToastManagerContext } from "./components/ToastManager";
import BackgroundMusic from "./components/BackgroundMusic";
import RegistrationScreen from "./components/RegistrationScreen";

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

// Туториал: 0 — открыть меню, 1 — посадить цветок, 2 — открыть меню, 3 — кнопки, 4 — жуки, 5 — удобрить, 6 — полить
const TUTORIAL_STEPS = [
  "Нажмите «Посадить цветок».",
  "Нажмите «Посадить цветок».",
  "Обратите внимание на кнопку с листиком (это удобрить), каплей (это полить) и спреем (это обработать).",
  "Иногда будут появлятся жуки и не давать полить и удобрять растения. Чтобы от них избавится покупайте спрей",
  "Нажмите «Удобрить».",
  "Нажмите «Полить».",
];

import ShopModal from "./components/ShopModal";
import LeadersModal from "./components/LeadersModal";
import { FaCrown } from "react-icons/fa";
import TasksModal from "./components/TasksModal";
import ProgressModal from "./components/ProgressModal";
import BackgroundModal from "./components/BackgroundModal";

function App() {
  // Автоотправка количества выращенных цветов каждые 14 минут
  useEffect(() => {
    const interval = setInterval(() => {
      const nickname = localStorage.getItem("flowersim.user");
      const flowersGrown = localStorage.getItem("flowersim.flowersGrown");
      if (nickname && flowersGrown) {
        fetch(`${API_BASE}/flowers-grown-count`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            flowersGrown: Number(flowersGrown),
          }),
        });
      }
    }, 14 * 60 * 1000); // 14 минут
    return () => clearInterval(interval);
  }, []);
  const [leadersOpen, setLeadersOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  // --- Состояние для модалки прокачки пробуждения ---

  const [canWater, setCanWater] = useState(false);
  const [canFertilize, setCanFertilize] = useState(false);
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
  const nickname = localStorage.getItem("flowersim.user");
  useEffect(() => {
    if (!nickname) return;
    // Считаем количество цветков, достигших максимального размера
    const grownCount = Object.values(progress.flowerSizes)
      .map(Number)
      .filter((size) => size >= MAX_FLOWER).length;
    (async () => {
      try {
        await fetch(`${API_BASE}/flowers-grown-count`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            count: grownCount,
          }),
        });
      } catch (e) {}
    })();
  }, [progress.flowerSizes, nickname]);
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
  const musicRef = useRef<{ playMusic: () => void }>(null);

  const handleStart = () => {
    // Отправляем ник пользователя на сервер при входе
    const nickname = localStorage.getItem("flowersim.user");
    if (nickname) {
      fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      })
        .then((res) => {
          if (res.status === 409) {
            // Пользователь уже есть — это нормально!
            return { user: { nickname } };
          }
          return res.json();
        })
        .catch(() => {});
    }
    setStarted(true);
    setTimeout(() => {
      musicRef.current?.playMusic();
    }, 0);
  };

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
  useEffect(() => {
    function updateCanActions() {
      const now = Date.now();
      setCanWater(now - progress.lastWater > 30 * 60 * 1000);
      setCanFertilize(now - progress.lastFertilize > 2 * 60 * 60 * 1000);
    }
    updateCanActions();
    const interval = setInterval(updateCanActions, 500);
    return () => clearInterval(interval);
  }, [progress.lastWater, progress.lastFertilize]);

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
  const [finalHintTimeout, setFinalHintTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
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
    const handlerShop = () => {
      setShopOpen(true);
      setMenuOpen(false);
    };
    window.addEventListener("openProgressModal", handlerProgress);
    window.addEventListener("openBackgroundModal", handlerBg);
    window.addEventListener("openShopModal", handlerShop);
    const handlerTasks = () => {
      setTasksModalOpen(true);
      setMenuOpen(false);
    };
    window.addEventListener("openTasksModal", handlerTasks);
    return () => {
      window.removeEventListener("openProgressModal", handlerProgress);
      window.removeEventListener("openBackgroundModal", handlerBg);
      window.removeEventListener("openShopModal", handlerShop);
      window.removeEventListener("openTasksModal", handlerTasks);
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
    // Шаг 3: показать подсказку про жуков и автоматически перейти к следующему шагу через 3-4 секунды
    if (tutorialStep === 3) {
      const timeout = setTimeout(() => {
        setTutorialStep(4);
        setProgress((p) => ({ ...p, tutorialStep: 4 }));
      }, 3500);
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
    const now = Date.now();
    // Только для новых пользователей продолжаем туториал
    if (progress.tutorialStep < 6) {
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
          tutorialStep: 5, // Переход на "Нажмите полить"
        };
        setTimeout(() => updateTaskProgress("fertilize"), 0);
        return newP;
      });
      setTutorialStep(5); // Переход на "Нажмите полить"
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
    const now = Date.now();
    const size = progress.flowerSizes[flowerSkin] || MIN_FLOWER;
    if (size >= MAX_FLOWER) {
      // Цветок вырос до максимума — отправляем на сервер
      (async () => {
        try {
          // Определяем номер цветка (например, по индексу или имени)
          // Здесь просто пример: можно усложнить по логике
          const flowerId =
            Object.keys(progress.flowerSizes).indexOf(flowerSkin) + 1;
          await fetch(`${API_BASE}/flower-grown`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nickname,
              flowerId,
              flowerSkin,
            }),
          });
        } catch (e) {
          // Можно добавить обработку ошибок
        }
      })();
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
        tutorialStep: 6, // Завершение туториала
      };
      setTimeout(() => updateTaskProgress("water"), 0);
      return newP;
    });
    setTutorialStep(6); // Завершение туториала
    setMenuOpen(false);
    toastApi?.showToast("Спасибо!");
    setTimeout(() => setShowFinalHint(true), 800);
  };

  // После завершения туториала скрываем его и показываем уведомление на 15 секунд
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
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

  // Для туториала
  const tutorialText = tutorialStep < 6 ? TUTORIAL_STEPS[tutorialStep] : "";

  if (!nickname) {
    return (
      <ToastManager>
        <RegistrationScreen onAuth={() => window.location.reload()} />
      </ToastManager>
    );
  }

  return (
    <ToastManager>
      {!started && !aboutOpen ? (
        <StartScreen onStart={handleStart} onAbout={() => setAboutOpen(true)} />
      ) : aboutOpen ? (
        <AboutGameScreen onBack={() => setAboutOpen(false)} />
      ) : (
        <>
          <BackgroundMusic ref={musicRef} play={started} />
          {/* Кнопка лидерборда в левом верхнем углу, без желтого фона, только иконка */}
          <button
            onClick={() => setLeadersOpen(true)}
            style={{
              position: "fixed",
              top: 98,
              left: 7,
              zIndex: 100,
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 36,
              boxShadow: "none",
              padding: 0,
            }}
            title="Лидеры"
          >
            <FaCrown style={{ color: "#ffb300", fontSize: 40 }} />
          </button>
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
            onLeaders={() => {
              setLeadersOpen(true);
              setMenuOpen(false);
            }}
          />

          {shopOpen && <ShopModal onClose={() => setShopOpen(false)} />}
          <LeadersModal
            isOpen={leadersOpen}
            onClose={() => setLeadersOpen(false)}
          />
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
            visible={showTutorial && tutorialStep < 6 && !!tutorialText}
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
