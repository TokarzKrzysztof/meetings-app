import { RefObject } from 'react';
import { StyledMessage } from 'src/components/chat/ChatMessage/ChatMessage.styled';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message, MessageType } from 'src/models/chat/message';
import { Typography } from 'src/ui-components';

export type ChatMessageMessageProps = {
  message: Message;
  isAuthorCurrentUser: boolean;
  repliedMessageWrap: number;
  anchorRef: RefObject<HTMLDivElement>;
  onFocusRepliedMessage: (toFocus: Message) => void;
  onLongPress: () => void;
};

export const ChatMessageMessage = ({
  message,
  isAuthorCurrentUser,
  repliedMessageWrap,
  anchorRef,
  onFocusRepliedMessage,
  onLongPress,
}: ChatMessageMessageProps) => {
  const longPressEvent = useLongPress(() => onLongPress());

  return (
    <>
      {message.replyTo && (
        <StyledMessage
          variant={isAuthorCurrentUser ? 'filled' : 'outlined'}
          sx={{
            transform: `translateY(${repliedMessageWrap}px)`,
            pb: `${repliedMessageWrap + 1}px`,
          }}
          onClick={() => onFocusRepliedMessage(message.replyTo!)}
          shrinkMessage
          type={message.replyTo.type}
        >
          {message.replyTo.type === MessageType.Image ? (
            <img
              style={{
                maxWidth: 200,
                opacity: 0.5,
                borderRadius: 10,
                transform: `translateY(${repliedMessageWrap}px)`,
              }}
              src={message.replyTo.value}
            />
          ) : (
            <Typography fontSize={12}>{message.replyTo.value} </Typography>
          )}
        </StyledMessage>
      )}
      <StyledMessage
        {...longPressEvent}
        id={message.id}
        ref={anchorRef}
        variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
        // transform to make message overlap
        sx={{ transform: 'translateY(0px)' }}
        type={message.type}
        isPending={message.isPending}
      >
        {message.type === MessageType.Image ? (
          <img style={{ maxWidth: '100%', borderRadius: 10 }} src={message.value} />
        ) : (
          <Typography fontSize={14}>{message.value} </Typography>
        )}
      </StyledMessage>
      {message.isPending && <Typography fontSize={11} color={'grey'}>Trwa wysyłanie...</Typography>}
    </>
  );
};
