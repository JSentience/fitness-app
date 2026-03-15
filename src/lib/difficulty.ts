export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Начальный",
  начальный: "Начальный",
  easy: "Легкий",
  легкий: "Легкий",
  medium: "Средний",
  middle: "Средний",
  средний: "Средний",
  hard: "Сложный",
  сложный: "Сложный",
};

export const DIFFICULTY_ICONS: Record<string, string> = {
  beginner: "/icons/difficulty/easy.svg",
  начальный: "/icons/difficulty/easy.svg",
  easy: "/icons/difficulty/easy.svg",
  легкий: "/icons/difficulty/easy.svg",
  medium: "/icons/difficulty/medium.svg",
  middle: "/icons/difficulty/medium.svg",
  средний: "/icons/difficulty/medium.svg",
  hard: "/icons/difficulty/hard.svg",
  сложный: "/icons/difficulty/hard.svg",
};

export const DEFAULT_DIFFICULTY_LABEL = "Начальный";
export const DEFAULT_DIFFICULTY_ICON = "/icons/difficulty/easy.svg";

export const normalizeDifficultyLabel = (difficulty: string): string => {
  if (!difficulty.trim()) return DEFAULT_DIFFICULTY_LABEL;
  return DIFFICULTY_LABELS[difficulty.trim().toLowerCase()] ?? difficulty;
};

export const getDifficultyIcon = (difficulty: string): string => {
  if (!difficulty.trim()) return DEFAULT_DIFFICULTY_ICON;
  return (
    DIFFICULTY_ICONS[difficulty.trim().toLowerCase()] ?? DEFAULT_DIFFICULTY_ICON
  );
};
