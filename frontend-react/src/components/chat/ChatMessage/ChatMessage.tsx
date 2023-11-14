import { useSetAtom } from 'jotai';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { StyledMessage, StyledReplyIcon } from 'src/components/chat/ChatMessage/ChatMessage.styled';
import { ChatMessageDragToReply } from 'src/components/chat/ChatMessage/ChatMessageDragToReply/ChatMessageDragToReply';
import { ChatMessageReactionPicker } from 'src/components/chat/ChatMessage/ChatMessageReactionPicker/ChatMessageReactionPicker';
import { ChatMessageReactions } from 'src/components/chat/ChatMessage/ChatMessageReactions/ChatMessageReactions';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { Box, Typography } from 'src/ui-components';

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
  const longPressEvent = useLongPress(() => setOpenReactions(true));

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
          {message.replyTo && (
            <StyledMessage
              variant={isAuthorCurrentUser ? 'filled' : 'outlined'}
              sx={{
                transform: `translateY(${repliedMessageWrap}px)`,
                pb: `${repliedMessageWrap + 1}px`,
              }}
              onClick={() => onFocusRepliedMessage(message.replyTo!)}
              shrinkMessage
            >
              <Typography fontSize={12}>{message.replyTo.text}</Typography>
            </StyledMessage>
          )}
          <StyledMessage
            {...longPressEvent}
            id={message.id}
            ref={anchorRef}
            variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
            // transform to make message overlap
            sx={{ transform: 'translateY(0px)' }}
          >
            <Typography fontSize={14}>{message.text}</Typography>
            <ChatMessageReactions reactions={message.reactions} />
          </StyledMessage>

          {moveX !== 0 && (
            <StyledReplyIcon
              name='reply'
              color='primary'
              dystans={maxMessageMovement}
              isAuthorCurrentUser={isAuthorCurrentUser}
            />
          )}
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
