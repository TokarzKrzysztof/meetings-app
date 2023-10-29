import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
import { Avatar, Box, Container, Stack, Typography } from 'src/ui-components';
import { calculateAge } from 'src/utils/user-utils';

export const Conversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();
  const { user } = useGetUser(searchParams.get('userId')!);
  const { conversation } = useGetConversation(user?.id as string, {
    enabled: !!user,
    onSuccess: (conversation) => setMessages(conversation.messages),
  });

  const lastMessageDate = _.last(messages)?.createdAt ?? null;
  const { latestConversationMessagesRefetch } = useGetLatestConversationMessages(
    { conversationId: conversation?.id as string, lastMessageDate },
    {
      enabled: !!conversation,
      refetchInterval: 5000,
      onSuccess: (messages) => {
        if (messages.length) {
          setMessages((prev) => prev.concat(messages));
        }
      },
    }
  );

  // getIsUserTyping
  const { sendMessage } = useSendMessage();
  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  const handleSend = (message: string) => {
    sendMessage(
      { text: message, conversationId: conversation!.id },
      {
        onSuccess: () => latestConversationMessagesRefetch(),
      }
    );
  };

  const newMessageBoxHeight = 50;
  if (!user) return null;
  return (
    <>
      <ConversationHeader user={user} />
      <Container sx={{ pt: 3, pb: `${newMessageBoxHeight}px` }}>
        <Stack flexDirection={'column'} alignItems={'center'}>
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
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          px: 1,
          backgroundColor: 'white',
          height: newMessageBoxHeight,
          bottom: 0,
        }}
      >
        <ConversationNewMessage onSend={handleSend} />
      </Box>
    </>
  );
};

Conversation.displayName = 'Conversation';
