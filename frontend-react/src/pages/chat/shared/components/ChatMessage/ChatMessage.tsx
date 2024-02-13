import _ from 'lodash';
import { useRef, useState } from 'react';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useSetClearableAtom } from 'src/hooks/useClearableAtom';
import { Chat, ChatType } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { StyledReplyIcon } from 'src/pages/chat/shared/components/ChatMessage/ChatMessage.styled';
import { ChatMessageContent } from 'src/pages/chat/shared/components/ChatMessageContent';
import { ChatMessageDragToReply } from 'src/pages/chat/shared/components/ChatMessageDragToReply';
import { ChatMessageReactionPicker } from 'src/pages/chat/shared/components/ChatMessageReactionPicker';
import { replyMessageAtom } from 'src/pages/chat/shared/components/ChatNewMessageReplyPreview';
import { useGetParticipant } from 'src/pages/chat/shared/hooks/useGetParticipant';
import { Box, Typography } from 'src/ui-components';

export type ChatMessageProps = {
  chat: Chat;
  message: Message;
  allMessages: Message[];
  currentUser: User;
  prevMessage?: Message;
  onStartReplyLastMessage: () => void;
};

export const ChatMessage = ({
  chat,
  message,
  allMessages,
  currentUser,
  prevMessage,
  onStartReplyLastMessage,
}: ChatMessageProps) => {
  const author = useGetParticipant(chat, message.authorId);
  const { setMessageReaction } = useSignalRActions();
  const setReplyMessage = useSetClearableAtom(replyMessageAtom);
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

  const maxMessageMovement = 80;
  const repliedMessageWrap = 15;
  const isAuthorCurrentUser = message.authorId === currentUser.id;
  const isPrevMessageSameAuthor = prevMessage?.authorId === message.authorId;
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
          display='flex'
          position='relative'
          flexDirection='column'
          alignItems={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          maxWidth={400}
          mt={message.replyTo ? 1.5 : 0.5}
          sx={{
            ...(isAuthorCurrentUser ? { marginLeft: '20px' } : { marginRight: '20px' }),
            opacity: openReactions ? 0.4 : 1,
            marginBottom: message.reactions.length ? 1 : undefined,
            transition: 'margin 200ms',
            pointerEvents: message.isPending ? 'none' : undefined,
            touchAction: message.isPending ? 'none' : undefined,
          }}
        >
          {chat.type === ChatType.Group && !isAuthorCurrentUser && !isPrevMessageSameAuthor && (
            <Typography fontSize={12} mt={2}>
              {`${author?.firstName} ${author?.lastName}`}
            </Typography>
          )}
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
