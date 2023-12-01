import { RefObject } from 'react';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message, MessageType } from 'src/models/chat/message';
import { StyledMessage } from 'src/pages/chat/shared/ChatMessage/ChatMessage.styled';
import { ChatMessageContentImage } from 'src/pages/chat/shared/ChatMessageContentImage';
import { ChatMessageContentVoiceMessage } from 'src/pages/chat/shared/ChatMessageContentVoiceMessage';
import { ChatVoiceMessageDescription } from 'src/pages/chat/shared/ChatVoiceMessageDescription';
import { Typography } from 'src/ui-components';
import { getFocusableId } from 'src/utils/chat-utils';

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
          isRepliedMessage
          type={message.replyTo.type}
        >
          {message.replyTo.type === MessageType.Image ? (
            <ChatMessageContentImage
              message={message.replyTo}
              maxHeight={200}
              style={{ opacity: 0.5, transform: `translateY(${repliedMessageWrap}px)` }}
            />
          ) : (
            <Typography fontSize={12}>
              {message.replyTo.type === MessageType.Audio ? (
                <ChatVoiceMessageDescription src={message.replyTo.value} />
              ) : (
                message.replyTo.value
              )}
            </Typography>
          )}
        </StyledMessage>
      )}
      <StyledMessage
        {...longPressEvent}
        id={message.type !== MessageType.Audio ? getFocusableId(message.id) : undefined}
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
          <ChatMessageContentImage message={message} maxHeight={300} />
        )}
        {message.type === MessageType.Audio && (
          <ChatMessageContentVoiceMessage id={getFocusableId(message.id)} src={message.value} />
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
