import { useSetAtom } from 'jotai';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { StyledReplyIcon } from 'src/pages/chat/shared/ChatMessage/ChatMessage.styled';
import { ChatMessageContent } from 'src/pages/chat/shared/ChatMessageContent';
import { ChatMessageDragToReply } from 'src/pages/chat/shared/ChatMessageDragToReply';
import { ChatMessageReactionPicker } from 'src/pages/chat/shared/ChatMessageReactionPicker';
import { ChatMessageReactions } from 'src/pages/chat/shared/ChatMessageReactions';
import { replyMessageAtom } from 'src/pages/chat/shared/ChatNewMessageReplyPreview';
import { Box } from 'src/ui-components';

export type ChatMessageProps = {
  message: Message;
  allMessages: Message[];
  currentUser: User;
  onStartReplyLastMessage: () => void;
};

export const ChatMessage = ({
  message,
  allMessages,
  currentUser,
  onStartReplyLastMessage,
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
      onStartReplyLastMessage();
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
            pointerEvents: message.isPending ? 'none' : undefined,
            touchAction: message.isPending ? 'none' : undefined,
          }}
        >
          <ChatMessageContent
            message={message}
            isAuthorCurrentUser={isAuthorCurrentUser}
            repliedMessageWrap={repliedMessageWrap}
            anchorRef={anchorRef}
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
