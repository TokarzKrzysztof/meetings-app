import { useSetAtom } from 'jotai';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { StyledReplyIcon } from 'src/components/chat/ChatMessage/ChatMessage.styled';
import { ChatMessageDragToReply } from 'src/components/chat/ChatMessage/ChatMessageDragToReply/ChatMessageDragToReply';
import { ChatMessageMessage } from 'src/components/chat/ChatMessage/ChatMessageMessage/ChatMessageMessage';
import { ChatMessageReactionPicker } from 'src/components/chat/ChatMessage/ChatMessageReactionPicker/ChatMessageReactionPicker';
import { ChatMessageReactions } from 'src/components/chat/ChatMessage/ChatMessageReactions/ChatMessageReactions';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { Box } from 'src/ui-components';

export type ChatMessageProps = {
  message: Message;
  allMessages: Message[];
  currentUser: User;
  onScrollToBottom: () => void;
  onFocusRepliedMessage: (toFocus: Message) => void;
};

export const ChatMessage = ({
  message,
  allMessages,
  currentUser,
  onScrollToBottom,
  onFocusRepliedMessage,
}: ChatMessageProps) => {
  const { setMessageReaction } = useSignalRActions();
  const setReplyMessage = useSetAtom(replyMessageAtom);
  const [openReactions, setOpenReactions] = useState(false);
  const [moveX, setMoveX] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleSelectReaction = (unified: string) => {
    setMessageReaction({
      messageId: message.id,
      reactionUnified: unified,
    });
    setOpenReactions(false);
  };

  const handleStartReply = () => {
    setReplyMessage(message);
    if (_.last(allMessages)?.id === message.id) {
      onScrollToBottom();
    }
  };

  const isAuthorCurrentUser = message.authorId === currentUser.id;
  const maxMessageMovement = 80;
  const repliedMessageWrap = 15;
  return (
    <>
      <ChatMessageDragToReply
        maxMovement={maxMessageMovement}
        moveX={moveX}
        setMoveX={setMoveX}
        onReply={handleStartReply}
        direction={isAuthorCurrentUser ? 'left' : 'right'}
      >
        <Box
          alignSelf={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          display={'flex'}
          position={'relative'}
          flexDirection={'column'}
          alignItems={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          maxWidth={400}
          sx={{
            ...(isAuthorCurrentUser ? { marginLeft: '20px' } : { marginRight: '20px' }),
            opacity: openReactions ? 0.4 : 1,
            marginBottom: message.reactions.length ? 1 : undefined,
            transition: 'margin 200ms',
            marginTop: message.replyTo ? `-${repliedMessageWrap}px` : undefined,
          }}
        >
          <ChatMessageMessage
            message={message}
            isAuthorCurrentUser={isAuthorCurrentUser}
            repliedMessageWrap={repliedMessageWrap}
            anchorRef={anchorRef}
            onFocusRepliedMessage={onFocusRepliedMessage}
            onLongPress={() => setOpenReactions(true)}
          />
          {moveX !== 0 && (
            <StyledReplyIcon
              name='reply'
              color='primary'
              dystans={maxMessageMovement}
              isAuthorCurrentUser={isAuthorCurrentUser}
            />
          )}
          <ChatMessageReactions reactions={message.reactions} />
        </Box>
      </ChatMessageDragToReply>

      <ChatMessageReactionPicker
        open={openReactions}
        anchorEl={anchorRef.current}
        message={message}
        currentUser={currentUser}
        onClose={() => setOpenReactions(false)}
        onSelectReaction={handleSelectReaction}
      />
    </>
  );
};
