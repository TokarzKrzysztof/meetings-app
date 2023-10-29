import { useState } from 'react';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';

export type ConversationNewMessageProps = {
  onSend: (message: string) => void;
};

export const ConversationNewMessage = ({ onSend }: ConversationNewMessageProps) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Stack alignItems={'flex-start'} gap={1} p={1}>
      <TextArea
        size='small'
        onChange={setMessage}
        value={message ?? ''}
        sx={{ flexGrow: 1 }}
        InputProps={{ sx: { borderRadius: 3 } }}
      ></TextArea>
      <IconButton
        color='primary'
        disabled={!message}
        onClick={() => {
          onSend(message!);
          setMessage(null);
        }}
      >
        <Icon name='send' />
      </IconButton>
    </Stack>
  );
};
