export const toDuration = (seconds?: number) => {
  if (seconds === undefined || seconds < 0) return '0:00';
  seconds = Math.ceil(seconds);

  if (seconds < 60) {
    return seconds < 10 ? `0:0${seconds}` : `0:${seconds}`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest < 10 ? `0${rest}` : rest}`;
};

export const getDuration = (src: string) => {
  return new Promise<number>((resolve) => {
    const audio = new Audio(src);
    audio.addEventListener('durationchange', function (e) {
      if (audio.duration != Infinity) {
        resolve(audio.duration);
      }
    });
    audio.currentTime = 24 * 60 * 60; //fake big time, bug in chrome to get duration
  });
};
