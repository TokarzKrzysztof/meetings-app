import { useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import {
  StyledMessageChip,
  StyledReplyIcon,
} from 'src/components/chat/ChatMessage/ChatMessage.styled';
import { ChatMessageReactionPicker } from 'src/components/chat/ChatMessage/ChatMessageReactionPicker/ChatMessageReactionPicker';
import { ChatMessageReactions } from 'src/components/chat/ChatMessage/ChatMessageReactions/ChatMessageReactions';
import { ChatMessageReply } from 'src/components/chat/ChatMessage/ChatMessageReply/ChatMessageReply';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { Box } from 'src/ui-components';

export type ChatMessageProps = {
  message: Message;
  allMessages: Message[];
  currentUser: User;
};

export const ChatMessage = ({ message, allMessages, currentUser }: ChatMessageProps) => {
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

  const isAuthorCurrentUser = message.authorId === currentUser.id;
  const maxMessageMovement = 80;
  const replyTo = message.replyToId ? allMessages.find((x) => x.id === message.replyToId)! : null;
  const repliedMessageWrap = 15;
  return (
    <>
      <ChatMessageReply
        maxMovement={maxMessageMovement}
        moveX={moveX}
        setMoveX={setMoveX}
        onReply={() => setReplyMessage(message)}
        direction={isAuthorCurrentUser ? 'left' : 'right'}
      >
        <Box
          {...longPressEvent}
          ref={anchorRef}
          position={'relative'}
          alignSelf={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          display={'flex'}
          flexDirection={'column'}
          alignItems={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          fontSize={14}
          maxWidth={400}
          sx={{
            ...(isAuthorCurrentUser ? { marginLeft: '20px' } : { marginRight: '20px' }),
            opacity: openReactions ? 0.4 : 1,
            marginBottom: message.reactions.length ? 1 : undefined,
            transition: '200ms',
            marginTop: replyTo ? `-${repliedMessageWrap}px` : undefined,
          }}
        >
          {replyTo && (
            <StyledMessageChip
              variant={isAuthorCurrentUser ? 'filled' : 'outlined'}
              label={replyTo.text}
              sx={{
                transform: `translateY(${repliedMessageWrap}px)`,
                pb: `${repliedMessageWrap + 1}px`,
              }}
            />
          )}
          <StyledMessageChip
            variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
            label={message.text}
            // transform to make message overlap
            sx={{
              transform: 'translateY(0px)',
              background: isAuthorCurrentUser ? 'white' : '#eee',
            }}
          />
          <ChatMessageReactions reactions={message.reactions} />
          {moveX !== 0 && (
            <StyledReplyIcon
              name='reply'
              color='primary'
              dystans={maxMessageMovement}
              isAuthorCurrentUser={isAuthorCurrentUser}
            />
          )}
        </Box>
      </ChatMessageReply>

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
