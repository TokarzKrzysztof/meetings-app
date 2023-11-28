import { RefObject } from 'react';
import { StyledMessage } from 'src/components/chat/ChatMessage/ChatMessage.styled';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message, MessageType } from 'src/models/chat/message';
import { Box, CircularProgress, Typography } from 'src/ui-components';

export type ChatMessageContentProps = {
  message: Message;
  isAuthorCurrentUser: boolean;
  repliedMessageWrap: number;
  anchorRef: RefObject<HTMLDivElement>;
  onFocusRepliedMessage: (toFocus: Message) => void;
  onLongPress: () => void;
};

export const ChatMessageContent = ({
  message,
  isAuthorCurrentUser,
  repliedMessageWrap,
  anchorRef,
  onFocusRepliedMessage,
  onLongPress,
}: ChatMessageContentProps) => {
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
        sx={{
          transform: 'translateY(0px)',
        }}
        type={message.type}
      >
        {message.type === MessageType.Text && (
          <Typography fontSize={14} sx={{ opacity: message.isPending ? 0.5 : undefined }}>
            {message.value}
          </Typography>
        )}
        {message.type === MessageType.Image && (
          <Box position={'relative'}>
            <img
              style={{
                opacity: message.isPending ? 0.5 : undefined,
                maxWidth: '100%',
                borderRadius: 10,
              }}
              src={message.value}
            />
            {message.isPending && <ProgressSpinner progress={message.progressPercentage} />}
          </Box>
        )}
        {message.type === MessageType.Audio && (
          <audio src={message.value} controls/>
        )}
      </StyledMessage>
      {message.isPending && (
        <Typography fontSize={11} color={'grey'}>
          Trwa wysyłanie...
        </Typography>
      )}
    </>
  );
};

const ProgressSpinner = ({ progress }: { progress: number }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress variant='determinate' value={progress} />
    </Box>
  );
};
