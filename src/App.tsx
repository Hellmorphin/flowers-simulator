import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import MainScreen from './components/MainScreen';
import Menu from './components/Menu';
import Tutorial from './components/Tutorial';
import ToastManager, { ToastManagerContext } from './components/ToastManager';

const FLOWER_KEY = 'flowersim.progress';

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
  'Нажмите на хвостик справа для открытия меню.',
  'Нажмите «Посадить цветок».',
  'Снова нажмите на хвостик, чтобы открыть меню.',
  'Нажмите «Удобрить».',
  'Нажмите «Полить».',
];

import ShopModal from './components/ShopModal';
import ProgressModal from './components/ProgressModal';
import BackgroundModal from './components/BackgroundModal';

function App() {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem(FLOWER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Миграция: если flowerSizes нет, создать и перенести размер
      if (!parsed.flowerSizes) {
        parsed.flowerSizes = { [localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png"]: parsed.flowerSize || 80 };
      }
      return parsed;
    }
    return defaultProgress;
  });
  // Получаем текущий скин цветка
  const flowerSkin = localStorage.getItem("flowersim.flowerSkin") || "Flowers1.png";
  // Размер для текущего цветка
  const currentFlowerSize = progress.flowerSizes[flowerSkin] ?? MIN_FLOWER;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => progress.tutorialStep < 5);
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
  const canFertilize = now - progress.lastFertilize > 3 * 60 * 60 * 1000;

  // Туториал логика
  const [tutorialStep, setTutorialStep] = useState<number>(progress.tutorialStep);
  const [showFinalHint, setShowFinalHint] = useState(() => {
    // Принудительно скрываем финальный туториал у старых пользователей
    if (progress.tutorialStep >= 5) return false;
    return localStorage.getItem('flowersim.finalHintShown') !== '1' && progress.tutorialStep >= 5;
  });
  const [finalHintTimeout, setFinalHintTimeout] = useState<NodeJS.Timeout | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [mainBg, setMainBg] = useState<string | null>(localStorage.getItem('flowersim.bg'));
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
    window.addEventListener('openProgressModal', handlerProgress);
    window.addEventListener('openBackgroundModal', handlerBg);
    return () => {
      window.removeEventListener('openProgressModal', handlerProgress);
      window.removeEventListener('openBackgroundModal', handlerBg);
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
      tutorialStep: 2
    }));
    setTutorialStep(2);
    setMenuOpen(false);
  };

  // Шаг 2: открыть меню снова
  useEffect(() => {
    if (tutorialStep === 2 && menuOpen) {
      setTutorialStep(3);
      setProgress((p) => ({ ...p, tutorialStep: 3 }));
    }
  }, [tutorialStep, menuOpen]);

  // Шаг 3: удобрить
  const handleFertilize = () => {
    if (!canFertilize) return;
    // Только для новых пользователей продолжаем туториал
    if (progress.tutorialStep < 5) {
      setProgress((p) => ({
        ...p,
        lastFertilize: now,
        flowerSizes: {
          ...p.flowerSizes,
          [flowerSkin]: Math.min(MAX_FLOWER, (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 10)
        },
        tutorialStep: 4,
      }));
      setTutorialStep(4);
    } else {
      setProgress((p) => ({
        ...p,
        lastFertilize: now,
        flowerSizes: {
          ...p.flowerSizes,
          [flowerSkin]: Math.min(MAX_FLOWER, (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 2)
        },
      }));
    }
    setMenuOpen(false);
    toastApi?.showToast('Удобрено!');
  };

  // Шаг 4: полить
  const handleWater = () => {
    if (!canWater) return;
    const size = progress.flowerSizes[flowerSkin] || MIN_FLOWER;
    if (size >= MAX_FLOWER) {
      (toastApi?.showToast || toastContext?.showToast)?.('Цветок Вырос до максимума!');
      setMenuOpen(false);
      return;
    }
    setProgress((p) => ({
      ...p,
      lastWater: now,
      flowerSizes: {
        ...p.flowerSizes,
  [flowerSkin]: Math.min(MAX_FLOWER, (p.flowerSizes[flowerSkin] || MIN_FLOWER) + 5)
      },
      tutorialStep: 5,
    }));
    setTutorialStep(5);
    setMenuOpen(false);
    toastApi?.showToast('Спасибо!');
    setTimeout(() => setShowFinalHint(true), 800);
  };

  // После завершения туториала скрываем его и показываем уведомление на 15 секунд
  useEffect(() => {
      let timeout: NodeJS.Timeout | null = null;
      if (tutorialStep >= 5 && localStorage.getItem('flowersim.finalHintShown') !== '1') {
        setShowTutorial(false);
        setShowFinalHint(true);
        if (finalHintTimeout) clearTimeout(finalHintTimeout);
        timeout = setTimeout(() => {
          setShowFinalHint(false);
          localStorage.setItem('flowersim.finalHintShown', '1');
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
  const tutorialText = progress.tutorialStep >= 5 ? '' : (TUTORIAL_STEPS[tutorialStep] || '');

  return (
    <ToastManager>
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <>
          {progress.tutorialStep < 5 && showFinalHint && localStorage.getItem('flowersim.finalHintShown') !== '1' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              background: 'rgba(255,236,179,0.98)',
              color: '#6d4c41',
              fontWeight: 600,
              fontSize: '1.1rem',
              textAlign: 'center',
              zIndex: 9999,
              padding: '0.7rem 0',
              boxShadow: '0 2px 16px #a1887f44',
            }}>
              Не забывай поливать цветок каждый час и удобрять каждые 3 часа игрового времени чтобы вырастить его.
            </div>
          )}
          <MainScreen
            flowerSize={currentFlowerSize}
            flowerVisible={progress.tutorialStep > 1 && currentFlowerSize > MIN_FLOWER - 1}
            potSkin={localStorage.getItem('flowersim.potSkin') || 'gorshok.jpg'}
            mainBg={mainBg}
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
            onShop={() => { setShopOpen(true); setMenuOpen(false); }}
          />
          {shopOpen && (
            <ShopModal onClose={() => setShopOpen(false)} />
          )}
          {progressModalOpen && (
            <ProgressModal isOpen={progressModalOpen} onClose={() => setProgressModalOpen(false)} />
          )}
          {backgroundModalOpen && (
            <BackgroundModal
              isOpen={backgroundModalOpen}
              onClose={() => setBackgroundModalOpen(false)}
              onApply={bg => { setMainBg(bg); }}
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
        </>
      )}
    </ToastManager>
  );
}

export default App;
