import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatNewMessageImage } from 'src/components/chat/ChatNewMessage/ChatNewMessageImage/ChatNewMessageImage';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { Chat } from 'src/models/chat/chat';
import { MessageType } from 'src/models/chat/message';
import {
  ImagePrivateMessageData,
  TextPrivateMessageData,
} from 'src/models/chat/send-private-message-data';
import { User } from 'src/models/user';
import { useSendPrivateMessage } from 'src/queries/chat-queries';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';

export type ChatNewMessageProps = {
  onScrollToBottom: () => void;
  recipient: User;
  chat: Chat | null | undefined;
  privateChatRefetch: () => void;
};

export const ChatNewMessage = ({
  onScrollToBottom,
  recipient,
  chat,
  privateChatRefetch,
}: ChatNewMessageProps) => {
  const { startTyping } = useSignalRActions();
  const { sendPrivateMessage } = useSendPrivateMessage();
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);
  const connection = useAtomValue(connectionAtom);
  const [message, setMessage] = useState<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyMessage && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [replyMessage]);

  const sendMessage = (data: TextPrivateMessageData | ImagePrivateMessageData) => {
    sendPrivateMessage(
      {
        connectionId: connection.connectionId!,
        recipientId: recipient.id,
        replyToId: replyMessage?.id,
        ...data,
      },
      {
        onSuccess: () => {
          if (!chat) privateChatRefetch();
        },
      }
    );

    setMessage(null);
    setReplyMessage(null);
  };

  const handleSendTextMessage = () => {
    sendMessage({
      value: message!,
      type: MessageType.Text,
    });
  };

  const handleSendImageMessage = (image: File) => {
    sendMessage({
      file: image,
      type: MessageType.Image,
    });
  };

  const onKeyUpThrottle = useMemo(() => {
    return _.throttle(
      () => {
        if (chat) startTyping({ chatId: chat.id });
      },
      2000,
      { trailing: false }
    );
  }, [chat]);

  return (
    <Stack alignItems={'flex-start'} p={1} pl={0}>
      <ChatNewMessageImage onSend={handleSendImageMessage}/>
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
      <IconButton
        color='primary'
        disabled={!message}
        onClick={handleSendTextMessage}
        sx={{ ml: 1 }}
      >
        <Icon name='send' />
      </IconButton>
    </Stack>
  );
};
