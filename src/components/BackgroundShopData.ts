// Данные для временных фонов
export const tempBackgrounds = [
  {
    name: "Forest.jpg",
    label: "Лес (только по пятницам 15:00-16:00, Владивосток)",
    file: "Forest.jpg",
    isActive: () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const vladivostok = new Date(utc + 10 * 60 * 60000);
      const day = vladivostok.getDay(); // 5 — пятница
      const hours = vladivostok.getHours();
      return day === 5 && hours === 17;
    },
  },
  {
    name: "loog.jpg",
    label: "Луг (только по понедельникам 15:00-16:00, Владивосток)",
    file: "loog.jpg",
    isActive: () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const vladivostok = new Date(utc + 10 * 60 * 60000);
      const day = vladivostok.getDay(); // 1 — понедельник
      const hours = vladivostok.getHours();
      return day === 1 && hours === 15;
    },
  },
];
