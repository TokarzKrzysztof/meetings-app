import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { Message } from 'src/models/conversation/message';
import { ConversationHeader } from 'src/pages/Conversation/ConversationHeader/ConversationHeader';
import { ConversationMessage } from 'src/pages/Conversation/ConversationMessage/ConversationMessage';
import { ConversationNewMessage } from 'src/pages/Conversation/ConversationNewMessage/ConversationNewMessage';
import { ConversationTypingIndicator } from 'src/pages/Conversation/ConversationTypingIndicator/ConversationTypingIndicator';
import { useGetConversation } from 'src/queries/conversation-queries';
import { useGetCurrentUser, useGetUser } from 'src/queries/user-queries';
import { Avatar, Container, Stack, Typography } from 'src/ui-components';
import { replaceItem } from 'src/utils/array-utils';
import { calculateAge } from 'src/utils/user-utils';

export const Conversation = () => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();
  const { currentUser } = useGetCurrentUser();
  const { user, userFetching } = useGetUser(searchParams.get('userId')!);
  const { conversation, conversationFetching } = useGetConversation(user?.id as string, {
    enabled: !userFetching,
    onSuccess: (conversation) => {
      if (conversation !== null) {
        setMessages(conversation.messages);
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
      <ConversationHeader user={user} />
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
            <ConversationMessage
              key={x.id}
              message={x}
              recipient={user}
              currentUser={currentUser}
            />
          ))}
        </Stack>
        <ConversationTypingIndicator />
      </Container>
      <ConversationNewMessage onFocus={scrollToBottom} recipient={user} />
    </Stack>
  );
};

Conversation.displayName = 'Conversation';
