import { useMemo, useRef, useState } from 'react';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Message } from 'src/models/chat/message';
import { ChatHeader } from 'src/pages/chat/shared/ChatHeader';
import { ChatNewMessage } from 'src/pages/chat/shared/ChatNewMessage';
import { ChatScrollable, ChatScrollableHandle } from 'src/pages/chat/shared/ChatScrollable';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/UserActiveStatusBadge';
import { useSignalRListeners } from 'src/pages/chat/shared/hooks/useSignalRListeners';
import { useUnloadListener } from 'src/pages/chat/shared/hooks/useUnloadListener';
import { ChatMessageFocusProvider } from 'src/pages/chat/shared/providers/ChatMessageFocusProvider';
import { useGetPrivateChat } from 'src/queries/chat-queries';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Stack, Typography } from 'src/ui-components';
import { PrivateChatParams } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export const PrivateChat = () => {
  const [params] = useRouteParams<PrivateChatParams>();
  const scrollableRef = useRef<ChatScrollableHandle>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useGetUser(params.userId);

  const pageSize = 20;
  const { privateChat, privateChatFetching, privateChatRefetch } = useGetPrivateChat(
    params.userId,
    pageSize,
    {
      onSuccess: (chat) => {
        if (chat !== null) setMessages(chat.messages);
      },
    }
  );

  useSignalRListeners(privateChat, setMessages);
  useUnloadListener(messages);

  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  if (!user || privateChatFetching) return null;
  return (
    <ChatMessageFocusProvider chat={privateChat} setMessages={setMessages}>
      <Stack height={'100vh'} direction={'column'}>
        <ChatHeader
          right={
            <Stack alignItems={'center'} gap={1}>
              <UserActiveStatusBadge status={user.activeStatus}>
                <Avatar src={user.profileImageSrc} size={30} />
              </UserActiveStatusBadge>
              <Typography>
                {user.firstName} {user.lastName}
              </Typography>
            </Stack>
          }
        />
        <ChatScrollable
          ref={scrollableRef}
          top={
            <Stack flexDirection={'column'} alignItems={'center'} mt={'auto'}>
              <Avatar src={user.profileImageSrc} size={100} sx={{ mb: 2 }} />
              <Typography>
                {user.firstName} {user.lastName}, {age}
              </Typography>
              <Typography>Limanowa (30 km od Ciebie)</Typography>
            </Stack>
          }
          messages={messages}
          setMessages={setMessages}
          chat={privateChat}
          pageSize={pageSize}
        />
        <ChatNewMessage
          onScrollToBottom={() => scrollableRef.current?.scrollToBottom('smooth')}
          recipient={user}
          chat={privateChat}
          onMessageSendSuccess={() => !privateChat && privateChatRefetch()}
          setMessages={setMessages}
        />
      </Stack>
    </ChatMessageFocusProvider>
  );
};

PrivateChat.displayName = 'PrivateChat';
