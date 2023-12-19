import { useSetAtom } from 'jotai';
import { RefObject } from 'react';
import { useLongPress } from 'src/hooks/useLongPress';
import { Message, MessageType } from 'src/models/chat/message';
import { StyledMessage } from 'src/pages/chat/shared/components/ChatMessage/ChatMessage.styled';
import { ChatMessageContentImage } from 'src/pages/chat/shared/components/ChatMessageContentImage';
import { ChatMessageContentReactions } from 'src/pages/chat/shared/components/ChatMessageContentReactions';
import { ChatMessageContentVoice } from 'src/pages/chat/shared/components/ChatMessageContentVoice';
import { ChatVoiceMessageDescription } from 'src/pages/chat/shared/components/ChatVoiceMessageDescription';
import { messageToFocusAtom } from 'src/pages/chat/shared/providers/ChatMessageFocusProvider';
import { Typography } from 'src/ui-components';
import { getFocusableId } from 'src/utils/chat-utils';

export type ChatMessageContentProps = {
  message: Message;
  isAuthorCurrentUser: boolean;
  repliedMessageWrap: number;
  anchorRef: RefObject<HTMLDivElement>;
  onLongPress: () => void;
};

export const ChatMessageContent = ({
  message,
  isAuthorCurrentUser,
  repliedMessageWrap,
  anchorRef,
  onLongPress,
}: ChatMessageContentProps) => {
  const setMessageToFocus = useSetAtom(messageToFocusAtom);
  const longPressEvent = useLongPress(() => onLongPress());

  return (
    <>
      {message.replyTo && (
        <StyledMessage
          variant={isAuthorCurrentUser ? 'filled' : 'outlined'}
          sx={{
            // mt to move it in dom
            mt: `-${repliedMessageWrap}px`,
            // transform to move visually
            transform: `translateY(${repliedMessageWrap}px)`,
          }}
          onClick={() => setMessageToFocus(message.replyTo!)}
          isRepliedMessage
          type={message.replyTo.type}
        >
          {message.replyTo.type === MessageType.Image ? (
            <ChatMessageContentImage
              message={message.replyTo}
              maxHeight={200}
              style={{ opacity: 0.5 }}
            />
          ) : (
            <Typography fontSize={12} pb={1}>
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
        onContextMenu={(e: Event) => e.preventDefault()}
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
          <ChatMessageContentVoice
            id={getFocusableId(message.id)}
            src={message.value}
            onLongPress={onLongPress}
          />
        )}
        <ChatMessageContentReactions message={message} />
      </StyledMessage>
      {message.isPending && (
        <Typography fontSize={11} color='grey'>
          Trwa wysyłanie...
        </Typography>
      )}
    </>
  );
};
