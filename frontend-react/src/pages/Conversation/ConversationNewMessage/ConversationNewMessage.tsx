import { useState } from 'react';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { User } from 'src/models/user';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';

export type ConversationNewMessageProps = {
  onFocus: () => void;
  recipient: User;
};

export const ConversationNewMessage = ({ onFocus, recipient }: ConversationNewMessageProps) => {
  const { sendPrivateMessage } = useSignalRActions();
  const [message, setMessage] = useState<string | null>(null);

  const handleSend = () => {
    sendPrivateMessage(message!, recipient.id);
    setMessage(null);
  };

  return (
    <Stack alignItems={'flex-start'} gap={1} p={1}>
      <TextArea
        size='small'
        onChange={setMessage}
        onFocus={onFocus}
        value={message ?? ''}
        sx={{ flexGrow: 1 }}
        InputProps={{ sx: { borderRadius: 3 } }}
      ></TextArea>
      <IconButton color='primary' disabled={!message} onClick={handleSend}>
        <Icon name='send' />
      </IconButton>
    </Stack>
  );
};
