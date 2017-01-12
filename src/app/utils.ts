export function formatSeconds(seconds: number) {
  seconds = seconds || 0;

  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  seconds = Math.floor(seconds);
  let secondsFormatted = seconds < 10 ? '0' + seconds : seconds;

  let formatted = `${minutes.toFixed(0)}:${secondsFormatted}`;
  if (hours) {
    formatted = `${hours.toFixed(0)}:${formatted}`;
  }

  return formatted
}
