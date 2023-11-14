import { useAtom, useSetAtom } from 'jotai';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { isTypingAtom } from 'src/components/chat/ChatTypingIndicator/ChatTypingIndicator';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { Chat } from 'src/models/chat/chat';
import { User } from 'src/models/user';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';

export type ChatNewMessageProps = {
  onScrollToBottom: () => void;
  recipient: User;
  chat: Chat | null | undefined;
};

export const ChatNewMessage = ({ onScrollToBottom, recipient, chat }: ChatNewMessageProps) => {
  const { sendPrivateMessage, startTyping } = useSignalRActions();
  const setIsTyping = useSetAtom(isTypingAtom);
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyMessage && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [replyMessage]);

  useSignalREffect('onOtherUserTyping', (userId) => {
    if (userId === recipient.id) {
      clearTimeout(timerRef.current);

      setIsTyping(true);
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
  });

  const handleSend = () => {
    sendPrivateMessage({
      text: message!,
      recipientId: recipient.id,
      replyTo: replyMessage,
    });
    setMessage(null);
    setReplyMessage(null);
  };

  const onKeyUpThrottle = useMemo(() => {
    return _.throttle(
      () => {
        if (chat) {
          startTyping({ chatId: chat.id });
        }
      },
      2000,
      { trailing: false }
    );
  }, []);

  return (
    <Stack alignItems={'flex-start'} gap={1} p={1}>
      <TextArea
        ref={fieldRef}
        size='small'
        onChange={setMessage}
        onFocus={() => !replyMessage && onScrollToBottom()}
        onKeyUp={onKeyUpThrottle}
        value={message ?? ''}
        sx={{ flexGrow: 1 }}
        InputProps={{ sx: { borderRadius: 3 } }}
      ></TextArea>
      <IconButton color='primary' disabled={!message} onClick={handleSend}>
        <Icon name='send' />
      </IconButton>
    </Stack>
  );
};
