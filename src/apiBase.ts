// src/apiBase.ts

const getApiBase = () => {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.REACT_APP_API_URL
  ) {
    return import.meta.env.REACT_APP_API_URL;
  }

  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    return "http://localhost:3001/api";
  }

  return "https://post-botify.ru/api";
};

export const API_BASE = getApiBase();
