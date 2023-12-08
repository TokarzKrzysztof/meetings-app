import { styled } from '@mui/material';
import { Emoji } from 'emoji-picker-react';
import { MessageReaction } from 'src/models/chat/message-reaction';
import { Stack } from 'src/ui-components';

const StyledWrapper = styled(Stack)(({ theme }) => ({
  background: theme.palette.common.white,
  border: '1px solid lightgrey',
  padding: '4px 8px',
  position: 'absolute',
  bottom: 0,
  right: 0,
  borderRadius: theme.shape.borderRadius * 3,
  transform: 'translateY(40%)',
}));

export type ChatMessageReactionsProps = {
  reactions: MessageReaction[];
};

export const ChatMessageReactions = ({ reactions }: ChatMessageReactionsProps) => {
  if (reactions.length === 0) return null;
  return (
    <StyledWrapper>
      {reactions.map((x) => (
        <Emoji key={x.id} size={15} unified={x.unified}></Emoji>
      ))}
    </StyledWrapper>
  );
};
