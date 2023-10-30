import _ from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { Message } from 'src/models/conversation/message';
import { ConversationHeader } from 'src/pages/Conversation/ConversationHeader/ConversationHeader';
import { ConversationMessages } from 'src/pages/Conversation/ConversationMessages/ConversationMessages';
import { ConversationNewMessage } from 'src/pages/Conversation/ConversationNewMessage/ConversationNewMessage';
import {
  useGetConversation,
  useGetLatestConversationMessages,
  useSendMessage,
} from 'src/queries/conversation-queries';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Container, Stack, Typography } from 'src/ui-components';
import { calculateAge } from 'src/utils/user-utils';

export const Conversation = () => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();
  const { user, userFetching } = useGetUser(searchParams.get('userId')!);
  const { conversation, conversationFetching } = useGetConversation(user?.id as string, {
    enabled: !userFetching,
    onSuccess: (conversation) => {
      setMessages(conversation.messages);
      scrollToBottom();
    },
  });

  const lastMessageDate = _.last(messages)?.createdAt ?? null;
  const { latestConversationMessagesRefetch } = useGetLatestConversationMessages(
    { conversationId: conversation?.id as string, lastMessageDate },
    {
      enabled: !conversationFetching,
      refetchInterval: 5000,
      onSuccess: (messages) => {
        if (messages.length) {
          setMessages((prev) => prev.concat(messages));
        }
      },
    }
  );

  const { sendMessage } = useSendMessage();
  // getIsUserTyping

  const handleSend = (message: string) => {
    sendMessage(
      { text: message, conversationId: conversation!.id },
      {
        onSuccess: () => latestConversationMessagesRefetch().then(scrollToBottom),
      }
    );
  };

  const scrollToBottom = () => {
    // wait for messages state to be updated
    setTimeout(() => {
      scrollableRef.current!.scrollTo(0, scrollableRef.current!.scrollHeight);
    });
  };

  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  if (!user) return null;
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
        <ConversationMessages messages={messages} />
      </Container>
      <ConversationNewMessage onSend={handleSend} onFocus={scrollToBottom} />
    </Stack>
  );
};

Conversation.displayName = 'Conversation';
