// Список скинов цветов и условия открытия (часы)
export const flowerSkins = [
  { name: "Стандартный", file: "Flowers1.png", unlock: 0 },
  { name: "Фиолетовый", file: "Flowers2.png", unlock: 3 },
  { name: "Голубой", file: "Flowers3.png", unlock: 6 },
  { name: "Желтый", file: "Flowers4.png", unlock: 12 },
  { name: "красная пика", file: "Flowers5.png", unlock: 24 },
  { name: "Ангел", file: "Flowers6.png", unlock: 48 },
  { name: "Демон", file: "Flowers7.png", unlock: "temp" }, // временный
  { name: "Кактус", file: "Flowers8.png", unlock: 72 },
  { name: "Цветочный", file: "Flowers9.png", unlock: 96 },
  { name: "Фикус", file: "Flowers10.png", unlock: 120 },
  { name: "Роза", file: "Flowers11.png", unlock: 150 },
  { name: "ОБАБОК", file: "Flowers12.png", unlock: 200 },
  { name: "БАОБАБ", file: "Flowers13.png", unlock: 250 },
  { name: "ДЕМОНОБАБОК", file: "Flowers14.png", unlock: "temp2" }, // временный
];

// --- ВРЕМЕННЫЕ ЦВЕТЫ ---
export const TEMP_FLOWER_KEY = "flowersim.tempFlowers";
export const TEMP_FLOWER_PERM_KEY = "flowersim.tempFlowers.permanent";
export const TEMP_FLOWER_DURATION = 3 * 60 * 60 * 1000; // 3 часа в мс

// --- ОКНО АКТИВАЦИИ ВРЕМЕННЫХ ЦВЕТОВ ---
export function isTempFlowerActive() {
  // Владивосток UTC+10
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vladivostokTime = new Date(utc + 10 * 60 * 60000);
  // День недели (0 — воскресенье, ...)
  // Flowers7: каждую неделю, пятница, 18:15–20:00
  // Flowers14: каждую неделю, суббота, 18:15–20:00
  const day = vladivostokTime.getDay();
  const hours = vladivostokTime.getHours();
  const minutes = vladivostokTime.getMinutes();
    // Flowers7: пятница, с 18:15 до 20:00 по Владивостоку (day === 5).
  if (day === 5 && (hours > 18 || (hours === 18 && minutes >= 15)) && (hours < 20 || (hours === 20 && minutes === 0))) {
    return "Flowers7.png";
  }
    // Flowers14: четверг, с 18:15 до 20:00 по Владивостоку (day === 4).
  if (day === 6 && (hours > 18 || (hours === 18 && minutes >= 15)) && (hours < 20 || (hours === 20 && minutes === 0))) {
    return "Flowers14.png";
  }
    // Flowers14: четверг
    if (day === 4 && (hours > 18 || (hours === 18 && minutes >= 15)) && (hours < 20 || (hours === 20 && minutes === 0))) {
      return "Flowers14.png";
    }
  return null;
}
