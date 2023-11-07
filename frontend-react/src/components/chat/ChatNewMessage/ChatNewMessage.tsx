import { useSetAtom } from 'jotai';
import _ from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { isTypingAtom } from 'src/components/chat/ChatTypingIndicator/ChatTypingIndicator';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { Chat } from 'src/models/chat/chat';
import { User } from 'src/models/user';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';

export type ChatNewMessageProps = {
  onFocus: () => void;
  recipient: User;
  chat: Chat | null | undefined;
};

export const ChatNewMessage = ({ onFocus, recipient, chat }: ChatNewMessageProps) => {
  const { sendPrivateMessage, startTyping } = useSignalRActions();
  const setIsTyping = useSetAtom(isTypingAtom);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSend = () => {
    sendPrivateMessage({ message: message!, recipientId: recipient.id });
    setMessage(null);
  };

  useSignalREffect('onOtherUserTyping', (userId) => {
    if (userId === recipient.id) {
      clearTimeout(timerRef.current);

      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  });

  const onKeyUpThrottle = useMemo(() => {
    return _.throttle(
      () => {
        if (chat) {
          startTyping({ chatId: chat.id });
        }
      },
      2000,
      { trailing: false }
    );
  }, []);

  return (
    <Stack alignItems={'flex-start'} gap={1} p={1}>
      <TextArea
        size='small'
        onChange={setMessage}
        onFocus={onFocus}
        onKeyUp={onKeyUpThrottle}
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
