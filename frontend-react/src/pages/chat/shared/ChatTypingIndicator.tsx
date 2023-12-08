import { useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { Chat } from 'src/models/chat/chat';
import { Typography } from 'src/ui-components';

export type ChatTypingIndicatorProps = {
  chat: Chat | null | undefined;
};

export const ChatTypingIndicator = ({ chat }: ChatTypingIndicatorProps) => {
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useSignalREffect(
    'onGetNewMessage',
    (message, chatId) => {
      if (chat?.id !== chatId) return;
      setTypingUser(null);
    },
    [chat]
  );

  useSignalREffect(
    'onOtherUserTyping',
    (userId, firstName, chatId) => {
      if (chat?.id !== chatId) return;
      clearTimeout(timerRef.current);

      setTypingUser(firstName);
      timerRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 3000);
    },
    [chat]
  );

  if (!typingUser) return null;
  return (
    <Typography pl={0.5} fontSize={12} color={'grey'} fontStyle={'italic'}>
      {typingUser} pisze{' '}
      <TypeAnimation
        sequence={['.', 100, '..', 100, '...', 800, '', 100]}
        repeat={Infinity}
        omitDeletionAnimation
        cursor={false}
        preRenderFirstString={false}
        style={{ fontSize: 16 }}
      />
    </Typography>
  );
};
