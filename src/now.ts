export const now = () => {
  const time = new Date();
  const h = time
    .getHours()
    .toString()
    .padStart(2, '0');
  const m = time
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const s = time
    .getSeconds()
    .toString()
    .padStart(2, '0');
  const ms = time
    .getMilliseconds()
    .toString()
    .padStart(3, '0');

  return `${h}:${m}:${s}.${ms}`;
};
