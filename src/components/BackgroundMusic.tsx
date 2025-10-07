import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { FaMusic, FaVolumeMute } from "react-icons/fa";
import MainMusic from "../assets/MainMusic.mp3";

const MUSIC_PAUSE = 10000; // пауза между проигрыванием, мс
const VOLUME = 0.0075;

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
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("musicOn") !== "0"
  );

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
    audio.volume = VOLUME;
    audioRef.current = audio;

    audio.play().catch(() => {});
    // Fade-in
    // fade-in отключён, громкость всегда VOLUME
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
  }, [play, enabled]);

  // Кнопка включения/выключения музыки
  return (
    <button
      style={{
        position: "absolute",
        right: 30,
        top: 54,
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
});

export default BackgroundMusic;
