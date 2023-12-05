import { styled } from '@mui/material';
import { ForwardedRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { useDeferredFunction } from 'src/hooks/useDeferredFunction';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { ChatGoDownBtn } from 'src/pages/chat/shared/ChatGoDownBtn';
import { ChatMessage } from 'src/pages/chat/shared/ChatMessage/ChatMessage';
import { ChatTypingIndicator } from 'src/pages/chat/shared/ChatTypingIndicator';
import { useLoadChatMessages } from 'src/queries/chat-queries';
import { Box, Container, Stack } from 'src/ui-components';
import { typedForwardRef } from 'src/utils/types/forward-ref';

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
})) as typeof Container;

const StyledScrollingAnchor = styled(Box)({
  // this elements allows content to be automatically scrolled down when new message is added or typing indicator is shown
  // element must have some height for this to work, and height is not working because of flex, so padding is used
  padding: 0.5,
  overflowAnchor: 'auto',
});

export type ChatScrollableHandle = {
  scrollToBottom: (behavior?: ScrollBehavior | undefined) => void;
};

export type ChatScrollableProps = {
  messages: Message[];
  top: ReactNode;
  chat: Chat | null | undefined;
  setMessages: (value: React.SetStateAction<Message[]>) => void;
};

const ChatScrollableInner = (
  { messages, top, chat, setMessages }: ChatScrollableProps,
  ref: ForwardedRef<ChatScrollableHandle>
) => {
  useImperativeHandle(
    ref,
    () => {
      return { scrollToBottom };
    },
    []
  );

  const pageSize = 20;

  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentUser = useLoggedInUser();
  const { loadChatMessagesAsync } = useLoadChatMessages();

  const scrollToBottom = useDeferredFunction((behavior: ScrollBehavior = 'auto') => {
    scrollableRef.current!.scrollTo({
      left: 0,
      top: scrollableRef.current!.scrollHeight,
      behavior,
    });
  });
  const scrollToPreviousScrollState = useDeferredFunction((prevScrollHeight: number) => {
    const currentScrollHeight = scrollableRef.current!.scrollHeight;
    scrollableRef.current!.scrollTo({ top: currentScrollHeight - prevScrollHeight });
  });

  const handleLoadChatMessages = async () => {
    if (!chat) return;

    const data = await loadChatMessagesAsync({
      chatId: chat!.id,
      skip: messages.length,
      take: pageSize,
    });

    setMessages((prev) => [...data, ...prev]);
    scrollToPreviousScrollState(scrollableRef.current!.scrollHeight);
  };

  return (
    <StyledScrollableContainer ref={scrollableRef}>
      {top}

      <Stack direction={'column'} py={1} gap={1}>
        <InfiniteScroll
          scrollableRef={scrollableRef}
          totalAmount={chat?.totalMessagesAmount as number}
          next={handleLoadChatMessages}
        >
          {messages.map((x) => (
            <ChatMessage
              key={x.id}
              message={x}
              allMessages={messages}
              currentUser={currentUser}
              onStartReplyLastMessage={scrollToBottom}
            />
          ))}
        </InfiniteScroll>
      </Stack>
      <ChatTypingIndicator chat={chat} />
      <StyledScrollingAnchor />
      <ChatGoDownBtn scrollableRef={scrollableRef} onGoDown={() => scrollToBottom('smooth')} />
    </StyledScrollableContainer>
  );
};

export const ChatScrollable = typedForwardRef(ChatScrollableInner);
