import { styled } from '@mui/material';
import { Emoji } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import { ChatMessageReactionPicker } from 'src/components/chat/ChatMessage/ChatMessageReactionPicker/ChatMessageReactionPicker';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { Box, Chip, Popover, Stack } from 'src/ui-components';

const StyledReactionsWrapper = styled(Stack)(({ theme }) => ({
  background: theme.palette.common.white,
  border: '1px solid lightgrey',
  padding: '4px 8px',
  position: 'absolute',
  bottom: 0,
  right: 0,
  borderRadius: theme.shape.borderRadius * 3,
  transform: 'translateY(50%)',
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
        }}
      >
        <Chip
          variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
          label={message.text}
          sx={{
            height: 'auto',
            display: 'block',
            p: 1,
            '& .MuiChip-label': {
              p: 0,
              display: 'block',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            },
          }}
        />
        {message.reactions.length !== 0 && (
          <StyledReactionsWrapper>
            {message.reactions.map((x) => (
              <Emoji key={x.id} size={15} unified={x.unified}></Emoji>
            ))}
          </StyledReactionsWrapper>
        )}
      </Box>
      <Popover
        open={openReactions}
        anchorEl={anchorRef.current}
        onClose={() => setOpenReactions(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              gap: 1,
              borderRadius: 4,
              p: 1,
            },
          },
        }}
      >
        <ChatMessageReactionPicker
          message={message}
          currentUser={currentUser}
          onSelectReaction={handleSelectReaction}
        />
      </Popover>
    </>
  );
};
