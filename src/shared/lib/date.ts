export const todayIso = () => new Date().toISOString().slice(0, 10);

export const formatDate = (value: string | null) => {
  if (!value) return "без срока";
  return new Intl.DateTimeFormat("ru-RU").format(new Date(value));
};

export const minutesLabel = (minutes: number) => {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} ч ${rest} мин` : `${hours} ч`;
};
