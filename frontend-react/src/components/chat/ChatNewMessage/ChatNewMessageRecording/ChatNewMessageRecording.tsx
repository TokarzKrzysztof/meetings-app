import { useEffect, useState } from 'react';
import { SendBtn } from 'src/components/chat/ChatNewMessage/ChatNewMessage.shared';
import { useVoiceRecording } from 'src/hooks/useVoiceRecording';
import { Icon, IconButton, TextField } from 'src/ui-components';

export type ChatNewMessageRecordingProps = {
  onCancel: () => void;
  onSend: (blob: Blob) => void;
};

export const ChatNewMessageRecording = ({ onCancel, onSend }: ChatNewMessageRecordingProps) => {
  const { start, stop } = useVoiceRecording();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    start();
    const intervalId = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toDuration = (seconds: number) => {
    if (seconds < 60) {
      return seconds < 10 ? `0:0${seconds}` : `0:${seconds}`;
    }

    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}:${rest < 10 ? `0${rest}` : rest}`;
  };

  return (
    <>
      <IconButton
        onClick={() => {
          stop();
          onCancel();
        }}
      >
        <Icon name='close' />
      </IconButton>
      <TextField
        disabled
        value={toDuration(duration)}
        size='small'
        sx={{ flexGrow: 1 }}
        InputProps={{ sx: { p: 0 } }}
      />
      <SendBtn
        onClick={() => {
          stop().then((blob) => onSend(blob));
        }}
      />
    </>
  );
};
