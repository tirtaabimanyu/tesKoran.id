export function toFixed(num, dec = 2) {
  if (Number.isInteger(num)) return num;
  return num.toFixed(dec);
}

export function parseSecond(second, withHour = false) {
  const hour = Math.floor(second / 3600);
  if (withHour) second = second % 3600;

  const minute = Math.floor(second / 60);
  second = second % 60;

  let str = "";
  if (withHour && hour) str += hour + "h";
  if (minute) str += minute + "m";
  if (second) str += second + "s";

  if (str.length == 0) str += "0s";
  return str;
}

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
