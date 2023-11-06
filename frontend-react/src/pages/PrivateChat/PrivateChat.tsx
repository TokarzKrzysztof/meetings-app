import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatHeader } from 'src/components/chat/ChatHeader/ChatHeader';
import { ChatMessage } from 'src/components/chat/ChatMessage/ChatMessage';
import { ChatNewMessage } from 'src/components/chat/ChatNewMessage/ChatNewMessage';
import { ChatTypingIndicator } from 'src/components/chat/ChatTypingIndicator/ChatTypingIndicator';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { Message } from 'src/models/chat/message';
import { useGetChat } from 'src/queries/chat-queries';
import { useGetCurrentUser, useGetUser } from 'src/queries/user-queries';
import { Avatar, Container, Stack, Typography } from 'src/ui-components';
import { replaceItem } from 'src/utils/array-utils';
import { calculateAge } from 'src/utils/user-utils';

export const PrivateChat = () => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();
  const { currentUser } = useGetCurrentUser();
  const { user, userFetching } = useGetUser(searchParams.get('userId')!);
  const { chat, chatFetching } = useGetChat(user?.id as string, {
    enabled: !userFetching,
    onSuccess: (chat) => {
      if (chat !== null) {
        setMessages(chat.messages);
        scrollToBottom();
      }
    },
  });

  // const lastMessageDate = _.last(messages)?.createdAt ?? null;

  useSignalREffect('onGetNewMessage', (msg) => {
    setMessages((prev) => [...prev, msg]);
    if (msg.authorId === currentUser?.id) {
      scrollToBottom();
    }
  });

  useSignalREffect('onMessageUpdate', (message) => {
    setMessages((prev) => {
      replaceItem(prev, message);
      return [...prev];
    });
  });

  const scrollToBottom = () => {
    // wait for messages state to be updated
    setTimeout(() => {
      scrollableRef.current!.scrollTo(0, scrollableRef.current!.scrollHeight);
    });
  };

  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  if (!user || !currentUser) return null;
  return (
    <Stack height={'100vh'} direction={'column'}>
      <ChatHeader user={user} />
      <Container
        ref={scrollableRef}
        sx={{
          pt: 3,
          overflow: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
        }}
      >
        <Stack flexDirection={'column'} alignItems={'center'} mt={'auto'}>
          <Avatar
            src={user.profileImage ?? avatarPlaceholder}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography>
            {user.firstName} {user.lastName}, {age}
          </Typography>
          <Typography>Limanowa (30 km od Ciebie)</Typography>
        </Stack>
        <Stack direction={'column'} py={1} gap={1}>
          {messages.map((x) => (
            <ChatMessage
              key={x.id}
              message={x}
              recipient={user}
              currentUser={currentUser}
            />
          ))}
        </Stack>
        <ChatTypingIndicator />
      </Container>
      <ChatNewMessage onFocus={scrollToBottom} recipient={user} />
    </Stack>
  );
};

PrivateChat.displayName = 'PrivateChat';