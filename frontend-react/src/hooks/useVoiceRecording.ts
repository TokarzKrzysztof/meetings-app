import { useRef, useState } from 'react';

export const useVoiceRecording = () => {
  const [hasPermission, setHasPermission] = useState(false);
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
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setHasPermission(true);

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
          chunksRef.current.push(event.data);
        });
      })
      .catch(() => {
        console.warn('permission denied');
      });
  };

  return { hasPermission, start, stop };
};
