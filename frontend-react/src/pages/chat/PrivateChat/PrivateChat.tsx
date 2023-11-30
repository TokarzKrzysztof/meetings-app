import { styled, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useDeferredFunction } from 'src/hooks/useDeferredFunction';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Message } from 'src/models/chat/message';
import { ChatGoDownBtn } from 'src/pages/chat/shared/ChatGoDownBtn';
import { ChatHeader } from 'src/pages/chat/shared/ChatHeader';
import { ChatLoadingOldMessagesDialog } from 'src/pages/chat/shared/ChatLoadingOldMessagesDialog';
import { ChatMessage } from 'src/pages/chat/shared/ChatMessage/ChatMessage';
import { ChatNewMessage } from 'src/pages/chat/shared/ChatNewMessage';
import { ChatTypingIndicator } from 'src/pages/chat/shared/ChatTypingIndicator';
import {
  useGetPrivateChat,
  useLoadAllMessagesAfterDate,
  useLoadMoreChatMessages,
  useMarkChatAsRead,
} from 'src/queries/chat-queries';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Box, Container, Stack, Typography } from 'src/ui-components';
import { replaceItem } from 'src/utils/array-utils';
import { PrivateChatParams } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

const StyledScrollableContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  position: 'relative',
  overflow: 'auto',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  // overflow hidden for message reply icon
  overflowX: 'hidden',
  '& *': {
    overflowAnchor: 'none',
  },
}));

const StyledScrollingAnchor = styled(Box)({
  // this elements allows content to be automatically scrolled down when new message is added or typing indicator is shown
  // element must have some height for this to work, and height is not working because of flex, so padding is used
  padding: 0.5,
  overflowAnchor: 'auto',
});

export const PrivateChat = () => {
  const [params] = useRouteParams<PrivateChatParams>();
  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentUser = useLoggedInUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLoadingOldMessagesDialog, setShowLoadingOldMessagesDialog] = useState(false);
  const { user, userFetching } = useGetUser(params.userId);
  const theme = useTheme();

  const scrollToBottom = useDeferredFunction((behavior: ScrollBehavior = 'auto') => {
    scrollableRef.current!.scrollTo({
      left: 0,
      top: scrollableRef.current!.scrollHeight,
      behavior,
    });
  });
  const scrollToPreviousScrollState = useDeferredFunction((prevScrollHeight: number) => {
    const currentScrollHeight = scrollableRef.current!.scrollHeight;
    scrollableRef.current!.scrollBy({ top: currentScrollHeight - prevScrollHeight });
  });
  const handleFocusRepliedMessageDeferred = useDeferredFunction((repliedMessage: Message) => {
    handleFocusRepliedMessage(repliedMessage);
  });

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
  const { loadMoreChatMessages } = useLoadMoreChatMessages();
  const { loadAllMessagesAfterDate } = useLoadAllMessagesAfterDate();
  const { markChatAsRead } = useMarkChatAsRead();

  useEffect(() => {
    if (!userFetching && !privateChatFetching) {
      scrollToBottom();
    }
  }, [userFetching, privateChatFetching]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (messages.some((x) => x.isPending)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [messages]);

  useSignalREffect(
    'onGetNewMessage',
    (msg) => {
      if (msg.authorId === currentUser.id) {
        setMessages((prev) => {
          // replace pending message
          replaceItem(prev, msg);
          return [...prev];
        });
      } else {
        setMessages((prev) => [...prev, msg]);
        markChatAsRead(privateChat!.id);
      }
    },
    [privateChat]
  );

  useSignalREffect('onMessageReactionChange', (message) => {
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

  const handlePendingMessageProgressChange = (id: Message['id'], progressPercentage: number) => {
    setMessages((prev) => {
      const item = prev.find((x) => x.id === id)!;
      item.progressPercentage = progressPercentage;
      replaceItem(prev, item);
      return [...prev];
    });
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
        <StyledScrollableContainer ref={scrollableRef}>
          {messages.length === privateChat?.totalMessagesAmount && (
            <Stack flexDirection={'column'} alignItems={'center'} mt={'auto'}>
              <Avatar src={user.profileImageSrc} size={100} sx={{ mb: 2 }} />
              <Typography>
                {user.firstName} {user.lastName}, {age}
              </Typography>
              <Typography>Limanowa (30 km od Ciebie)</Typography>
            </Stack>
          )}
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
                  onStartReplyLastMessage={scrollToBottom}
                  onFocusRepliedMessage={handleFocusRepliedMessage}
                />
              ))}
            </InfiniteScroll>
          </Stack>
          <ChatTypingIndicator />
          <StyledScrollingAnchor />
          <ChatGoDownBtn scrollableRef={scrollableRef} onGoDown={() => scrollToBottom('smooth')} />
        </StyledScrollableContainer>
        <ChatNewMessage
          onScrollToBottom={scrollToBottom}
          recipient={user}
          currentUser={currentUser}
          chat={privateChat}
          privateChatRefetch={privateChatRefetch}
          onAddPendingMessage={(msg) => setMessages((prev) => [...prev, msg])}
          onPendingMessageProgressChange={handlePendingMessageProgressChange}
        />
      </Stack>
      {showLoadingOldMessagesDialog && (
        <ChatLoadingOldMessagesDialog onClose={() => setShowLoadingOldMessagesDialog(false)} />
      )}
    </>
  );
};

PrivateChat.displayName = 'PrivateChat';
