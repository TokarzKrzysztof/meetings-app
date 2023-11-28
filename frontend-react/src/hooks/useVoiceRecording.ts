import { useRef } from 'react';

export const useVoiceRecording = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stop = () => {
    return new Promise<Blob>((resolve) => {
      mediaRecorderRef.current!.addEventListener('stop', () => {
        resolve(new Blob(chunksRef.current, { type: 'audio/mp3' }));
        chunksRef.current = [];
      });
      mediaRecorderRef.current!.stop();
    });
  };

  const start = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        chunksRef.current.push(event.data);
      });
    });
  };

  return { start, stop };
};
