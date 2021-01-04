export const getTime = function(): string {
  const timeStr = (new Date()).toLocaleString().replace(',', '');
  return timeStr;
};
