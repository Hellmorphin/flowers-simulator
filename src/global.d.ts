// Расширяем глобальный объект window для поддержки playClick2
export {};

declare global {
  interface Window {
    playClick2?: () => void;
  }
}
