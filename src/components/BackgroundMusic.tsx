import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FaMusic, FaVolumeMute } from "react-icons/fa";
import MainMusic from "../assets/MainMusic.mp3";
import MusicModal from "./MusicModal";

const MUSIC_PAUSE = 10000; // пауза между проигрыванием, мс
const DEFAULT_VOLUME = 0.0075;

const BackgroundMusic = forwardRef(({ play }: { play: boolean }, ref) => {
  useImperativeHandle(ref, () => ({
    playMusic: () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    },
  }));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(() => localStorage.getItem("musicOn") !== "0");
  const [showModal, setShowModal] = useState(false);
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem("musicVolume");
    return v ? Number(v) : DEFAULT_VOLUME;
  });

  useEffect(() => {
    if (!play || !enabled) return;
    // Очищаем предыдущий аудио, если был
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    const audio = new Audio(MainMusic);
    audio.loop = false;
    audio.volume = volume;
    audioRef.current = audio;

    audio.play().catch(() => {});
    // Fade-in
    // fade-in отключён, громкость всегда volume
    const handleEnded = () => {
      pauseTimeoutRef.current = window.setTimeout(() => {
        audio.currentTime = 0;
        audio.play();
      }, MUSIC_PAUSE);
    };
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      if (fadeTimeoutRef.current) clearInterval(fadeTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      audio.pause();
      audioRef.current = null;
    };
  }, [play, enabled, volume]);

  // Определяем iOS
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // Только кнопка вкл/выкл
    return (
      <button
        style={{
          position: "absolute",
          right: 30,
          top: 115,
          zIndex: 100,
          background: "none",
          border: "none",
          borderRadius: 20,
          padding: 0,
          cursor: "pointer",
          boxShadow: "none",
          color: "orange",
        }}
        onClick={() => {
          setEnabled((v) => {
            localStorage.setItem("musicOn", v ? "0" : "1");
            return !v;
          });
        }}
        aria-label={enabled ? "Выключить музыку" : "Включить музыку"}
      >
        {enabled ? <FaMusic size={32} /> : <FaVolumeMute size={32} />}
      </button>
    );
  }
  // На остальных платформах — модалка
  return (
    <>
      <button
        style={{
          position: "absolute",
          right: 30,
          top: 115,
          zIndex: 100,
          background: "none",
          border: "none",
          borderRadius: 20,
          padding: 0,
          cursor: "pointer",
          boxShadow: "none",
          color: "orange",
        }}
        onClick={() => setShowModal(true)}
        aria-label={enabled ? "Открыть настройки музыки" : "Открыть настройки музыки"}
      >
        {enabled ? <FaMusic size={32} /> : <FaVolumeMute size={32} />}
      </button>
      {showModal && (
        <MusicModal
          enabled={enabled}
          volume={volume}
          onClose={() => setShowModal(false)}
          onToggle={() => {
            setEnabled((v) => {
              localStorage.setItem("musicOn", v ? "0" : "1");
              return !v;
            });
          }}
          onVolumeChange={(v) => {
            setVolume(v);
            localStorage.setItem("musicVolume", String(v));
          }}
        />
      )}
    </>
  );
});

export default BackgroundMusic;
