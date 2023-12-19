import { useEffect, useState } from 'react';
import { getDuration, toDuration } from 'src/utils/audio-utils';

export type ChatVoiceMessageDescriptionProps = {
  src: string;
};

export const ChatVoiceMessageDescription = ({ src }: ChatVoiceMessageDescriptionProps) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    getDuration(src).then((result) => {
      setDuration(result);
    });
  }, [src]);

  return <>Wiadomość głosowa: {toDuration(duration)}</>;
};
