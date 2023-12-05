import { useRef, useState } from 'react';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Message } from 'src/models/chat/message';
import { ChatHeader } from 'src/pages/chat/shared/ChatHeader';
import { ChatNewMessage } from 'src/pages/chat/shared/ChatNewMessage';
import { ChatScrollable, ChatScrollableHandle } from 'src/pages/chat/shared/ChatScrollable';
import { useSignalRListeners } from 'src/pages/chat/shared/hooks/useSignalRListeners';
import { useUnloadListener } from 'src/pages/chat/shared/hooks/useUnloadListener';
import { ChatMessageFocusProvider } from 'src/pages/chat/shared/providers/ChatMessageFocusProvider';
import { useGetGroupChat } from 'src/queries/chat-queries';
import { Stack, Typography } from 'src/ui-components';
import { GroupChatParams } from 'src/utils/enums/app-routes';

export const GroupChat = () => {
  const [params] = useRouteParams<GroupChatParams>();
  const scrollableRef = useRef<ChatScrollableHandle>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { groupChat } = useGetGroupChat(params.chatId);

  useSignalRListeners(groupChat, setMessages);
  useUnloadListener(messages);

  if (!groupChat) return null;
  return (
    <ChatMessageFocusProvider chat={groupChat} setMessages={setMessages}>
      <Stack height={'100vh'} direction={'column'}>
        <ChatHeader
          right={
            <Stack alignItems={'center'} gap={1}>
              {/* <UserActiveStatusBadge status={user.activeStatus}>
                <Avatar src={user.profileImageSrc} size={30} />
              </UserActiveStatusBadge> */}
              <Typography>{groupChat!.name}</Typography>
            </Stack>
          }
        />
        <ChatScrollable
          ref={scrollableRef}
          top={
            <Stack flexDirection={'column'} alignItems={'center'} mt={'auto'}>
              <Typography>Na górze</Typography>
              {/* <Avatar src={user.profileImageSrc} size={100} sx={{ mb: 2 }} />
              <Typography>
                {user.firstName} {user.lastName}, {age}
              </Typography>
              <Typography>Limanowa (30 km od Ciebie)</Typography> */}
            </Stack>
          }
          messages={messages}
          setMessages={setMessages}
          chat={groupChat}
        />
        <ChatNewMessage
          onScrollToBottom={() => scrollableRef.current?.scrollToBottom('smooth')}
          chat={groupChat}
          setMessages={setMessages}
        />
      </Stack>
    </ChatMessageFocusProvider>
  );
};

GroupChat.displayName = 'GroupChat';