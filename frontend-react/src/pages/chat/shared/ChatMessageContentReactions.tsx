import { styled } from '@mui/material';
import { Emoji } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import { Message } from 'src/models/chat/message';
import { ChatMessageContentReactionsPreview } from 'src/pages/chat/shared/ChatMessageContentReactionsPreview';
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

export type ChatMessageContentReactionsProps = {
  message: Message;
};

export const ChatMessageContentReactions = ({ message }: ChatMessageContentReactionsProps) => {
  const [openReactionsPreview, setOpenReactionsPreview] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  if (message.reactions.length === 0) return null;
  return (
    <>
      <StyledWrapper ref={anchorRef} onClick={() => setOpenReactionsPreview(true)}>
        {message.reactions.map((x) => (
          <Emoji key={x.id} size={15} unified={x.unified}></Emoji>
        ))}
      </StyledWrapper>
      {openReactionsPreview && (
        <ChatMessageContentReactionsPreview
          anchorEl={anchorRef.current}
          message={message}
          onClose={() => setOpenReactionsPreview(false)}
        />
      )}
    </>
  );
};
