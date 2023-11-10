import { styled } from '@mui/material';
import { useRef, useState } from 'react';
import { ChatMessageReactionPicker } from 'src/components/chat/ChatMessage/ChatMessageReactionPicker/ChatMessageReactionPicker';
import { ChatMessageReactions } from 'src/components/chat/ChatMessage/ChatMessageReactions/ChatMessageReactions';
import { ChatMessageReply } from 'src/components/chat/ChatMessage/ChatMessageReply/ChatMessageReply';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { Box, Chip } from 'src/ui-components';

const StyledMessageChip = styled(Chip)(({ theme }) => ({
  height: 'auto',
  display: 'block',
  padding: theme.spacing(1),
  '& .MuiChip-label': {
    padding: 0,
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
}));

export type ChatMessageProps = {
  message: Message;
  currentUser: User;
};

export const ChatMessage = ({ message, currentUser }: ChatMessageProps) => {
  const { setMessageReaction } = useSignalRActions();
  const [openReactions, setOpenReactions] = useState(false);
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
  return (
    <>
      <ChatMessageReply onReply={() => console.log(message.id)}>
        <Box
          {...longPressEvent}
          ref={anchorRef}
          position={'relative'}
          alignSelf={isAuthorCurrentUser ? 'flex-end' : 'flex-start'}
          fontSize={14}
          maxWidth={400}
          sx={{
            ...(isAuthorCurrentUser ? { marginLeft: '20px' } : { marginRight: '20px' }),
            opacity: openReactions ? 0.4 : 1,
            marginBottom: message.reactions.length ? 1 : undefined,
            transition: '200ms',
          }}
        >
          <StyledMessageChip
            variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
            label={message.text}
          />
          <ChatMessageReactions reactions={message.reactions} />
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
