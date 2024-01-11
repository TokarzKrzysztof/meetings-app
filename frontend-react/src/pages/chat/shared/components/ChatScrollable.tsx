import { styled } from '@mui/material';
import { Dispatch, ForwardedRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { useDeferredFunction } from 'src/hooks/useDeferredFunction';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { Message, MessageType } from 'src/models/chat/message';
import { ChatGoDownBtn } from 'src/pages/chat/shared/components/ChatGoDownBtn';
import { ChatInfoMessage } from 'src/pages/chat/shared/components/ChatInfoMessage';
import { ChatMessage } from 'src/pages/chat/shared/components/ChatMessage/ChatMessage';
import { ChatTypingIndicator } from 'src/pages/chat/shared/components/ChatTypingIndicator';
import { MessageAction } from 'src/pages/chat/shared/reducers/message.reducer';
import { useLoadChatMessages } from 'src/queries/message-queries';
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
  dispatch: Dispatch<MessageAction>;
};

const ChatScrollableInner = (
  { messages, top, chat, dispatch }: ChatScrollableProps,
  ref: ForwardedRef<ChatScrollableHandle>
) => {
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

    dispatch({ type: 'prepend-range', messageList: data });
    scrollToPreviousScrollState(scrollableRef.current!.scrollHeight);
  };

  useImperativeHandle(ref, () => ({ scrollToBottom }), []);
  return (
    <StyledScrollableContainer ref={scrollableRef}>
      {top}

      <Stack direction='column' py={1}>
        <InfiniteScroll
          direction='up'
          scrollable={scrollableRef.current}
          totalAmount={chat?.totalMessagesAmount as number}
          next={handleLoadChatMessages}
        >
          {messages.map((x, i) =>
            x.type === MessageType.Info ? (
              <ChatInfoMessage key={x.id} message={x} />
            ) : (
              <ChatMessage
                key={x.id}
                message={x}
                chat={chat!}
                allMessages={messages}
                currentUser={currentUser}
                prevMessage={messages[i - 1]}
                onStartReplyLastMessage={scrollToBottom}
              />
            )
          )}
        </InfiniteScroll>
      </Stack>
      <ChatTypingIndicator chat={chat} />
      <StyledScrollingAnchor />
      <ChatGoDownBtn scrollableRef={scrollableRef} onGoDown={() => scrollToBottom('smooth')} />
    </StyledScrollableContainer>
  );
};

export const ChatScrollable = typedForwardRef(ChatScrollableInner);
