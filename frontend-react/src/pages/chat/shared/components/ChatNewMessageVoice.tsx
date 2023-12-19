import { useEffect, useState } from 'react';
import { useVoiceRecording } from 'src/hooks/useVoiceRecording';
import { ChatSendBtn } from 'src/pages/chat/shared/components/ChatSendBtn';
import { Icon, IconButton, TextField } from 'src/ui-components';
import { toDuration } from 'src/utils/audio-utils';

export type ChatNewMessageVoiceProps = {
  onCancel: () => void;
  onSend: (blob: Blob) => void;
};

export const ChatNewMessageVoice = ({ onCancel, onSend }: ChatNewMessageVoiceProps) => {
  const { hasPermission, start, stop } = useVoiceRecording();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      hasPermission && setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hasPermission]);

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
      <ChatSendBtn
        onClick={() => {
          stop().then((blob) => onSend(blob));
        }}
      />
    </>
  );
};
