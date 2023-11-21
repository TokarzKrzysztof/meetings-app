import { useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll/InfiniteScroll';
import { ChatHeader } from 'src/components/chat/ChatHeader/ChatHeader';
import { ChatLoadingOldMessagesDialog } from 'src/components/chat/ChatLoadingOldMessagesDialog/ChatLoadingOldMessagesDialog';
import { ChatMessage } from 'src/components/chat/ChatMessage/ChatMessage';
import { ChatNewMessage } from 'src/components/chat/ChatNewMessage/ChatNewMessage';
import { ChatReplyPreview } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { ChatTypingIndicator } from 'src/components/chat/ChatTypingIndicator/ChatTypingIndicator';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useDeferredFunction } from 'src/hooks/useDeferredFunction';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Message } from 'src/models/chat/message';
import {
  useGetPrivateChat,
  useLoadAllMessagesAfterDate,
  useLoadMoreChatMessages,
} from 'src/queries/chat-queries';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Container, Stack, Typography } from 'src/ui-components';
import { replaceItem } from 'src/utils/array-utils';
import { PrivateChatParams } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export const PrivateChat = () => {
  const [params] = useRouteParams<PrivateChatParams>();
  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentUser = useLoggedInUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLoadingOldMessagesDialog, setShowLoadingOldMessagesDialog] = useState(false);
  const { user, userFetching } = useGetUser(params.userId);
  const theme = useTheme();

  const scrollToBottom = useDeferredFunction(() => {
    scrollableRef.current!.scrollTo(0, scrollableRef.current!.scrollHeight);
  });
  const scrollToPreviousScrollState = useDeferredFunction((prevScrollHeight: number) => {
    const currentScrollHeight = scrollableRef.current!.scrollHeight;
    scrollableRef.current!.scrollBy({ top: currentScrollHeight - prevScrollHeight });
  });
  const handleFocusRepliedMessageDeferred = useDeferredFunction((repliedMessage: Message) => {
    handleFocusRepliedMessage(repliedMessage);
  });

  const pageSize = 20;
  const { privateChat, privateChatFetching } = useGetPrivateChat(params.userId, pageSize, {
    onSuccess: (chat) => {
      if (chat !== null) setMessages(chat.messages);
    },
  });
  const { loadMoreChatMessages } = useLoadMoreChatMessages();
  const { loadAllMessagesAfterDate } = useLoadAllMessagesAfterDate();

  useEffect(() => {
    if (!userFetching && !privateChatFetching) {
      scrollToBottom();
    }
  }, [userFetching, privateChatFetching]);

  useSignalREffect('onGetNewMessage', (msg) => {
    setMessages((prev) => [...prev, msg]);
    if (msg.authorId === currentUser.id) {
      scrollToBottom();
    }
  });

  useSignalREffect('onMessageUpdate', (message) => {
    setMessages((prev) => {
      replaceItem(prev, message);
      return [...prev];
    });
  });

  const handleLoadMoreMessages = () => {
    loadMoreChatMessages(
      {
        chatId: privateChat!.id,
        skip: messages.length,
        take: pageSize,
      },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...data, ...prev]);
          scrollToPreviousScrollState(scrollableRef.current!.scrollHeight);
        },
      }
    );
  };

  const handleFocusRepliedMessage = (repliedMessage: Message) => {
    const element = document.getElementById(repliedMessage.id)!;
    if (element) {
      element.scrollIntoView({ block: 'center' });
      animateMessage(element);
    } else {
      setShowLoadingOldMessagesDialog(true);
      loadAllMessagesAfterDate(
        {
          chatId: privateChat!.id,
          afterDate: repliedMessage.createdAt,
        },
        {
          onSuccess: (data) => {
            setMessages(data);
            handleFocusRepliedMessageDeferred(repliedMessage);
            setShowLoadingOldMessagesDialog(false);
          },
        }
      );
    }
  };

  const animateMessage = (element: HTMLElement) => {
    element.style.boxShadow = `0px 0px 0px 1px ${theme.palette.primary.main}`;
    element.style.transition = 'box-shadow 400ms';
    setTimeout(() => {
      element.style.boxShadow = '';
      element.style.transition = '';
    }, 1000);
  };

  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  if (!user) return null;
  return (
    <>
      <Stack height={'100vh'} direction={'column'}>
        <ChatHeader user={user} returnUrl={params.returnUrl} />
        <Container
          ref={scrollableRef}
          sx={{
            pt: 3,
            overflow: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            mx: 'auto',
            // overflow hidden for message reply icon
            overflowX: 'hidden',
          }}
        >
          <Stack flexDirection={'column'} alignItems={'center'} mt={'auto'}>
            <Avatar src={user.profileImage} size={100} sx={{ mb: 2 }} />
            <Typography>
              {user.firstName} {user.lastName}, {age}
            </Typography>
            <Typography>Limanowa (30 km od Ciebie)</Typography>
          </Stack>
          <Stack direction={'column'} py={1} gap={1}>
            <InfiniteScroll
              scrollableRef={scrollableRef}
              totalAmount={privateChat?.totalMessagesAmount as number}
              next={handleLoadMoreMessages}
            >
              {messages.map((x) => (
                <ChatMessage
                  key={x.id}
                  message={x}
                  allMessages={messages}
                  currentUser={currentUser}
                  onScrollToBottom={scrollToBottom}
                  onFocusRepliedMessage={handleFocusRepliedMessage}
                />
              ))}
            </InfiniteScroll>
          </Stack>
          <ChatTypingIndicator />
        </Container>
        <ChatReplyPreview />
        <ChatNewMessage onScrollToBottom={scrollToBottom} recipient={user} chat={privateChat} />
      </Stack>
      {showLoadingOldMessagesDialog && (
        <ChatLoadingOldMessagesDialog onClose={() => setShowLoadingOldMessagesDialog(false)} />
      )}
    </>
  );
};

PrivateChat.displayName = 'PrivateChat';
