import { useRef } from 'react';

export const useAlarm = (src = '/alarm.mp3') => {
  const audioRef = useRef(new Audio(src));

  const playAlarm = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return { playAlarm, stopAlarm };
};