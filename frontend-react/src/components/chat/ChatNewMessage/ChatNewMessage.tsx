import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChatNewMessageImage } from 'src/components/chat/ChatNewMessage/ChatNewMessageImage/ChatNewMessageImage';
import { replyMessageAtom } from 'src/components/chat/ChatReplyPreview/ChatReplyPreview';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useQueue } from 'src/hooks/useQueue';
import { Chat } from 'src/models/chat/chat';
import { Message, MessageType } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { useSendPrivateMessage } from 'src/queries/chat-queries';
import { Icon, IconButton, Stack, TextArea } from 'src/ui-components';
import { fileToBase64, isFile } from 'src/utils/file-utils';

export type ChatNewMessageProps = {
  onScrollToBottom: () => void;
  currentUser: User;
  recipient: User;
  chat: Chat | null | undefined;
  privateChatRefetch: () => void;
  onAddPendingMessage: (message: Message) => void;
  onPendingMessageProgressChange: (id: Message['id'], progressPercentage: number) => void;
};

export const ChatNewMessage = ({
  onScrollToBottom,
  currentUser,
  recipient,
  chat,
  privateChatRefetch,
  onAddPendingMessage,
  onPendingMessageProgressChange,
}: ChatNewMessageProps) => {
  const { startTyping } = useSignalRActions();
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);
  const connection = useAtomValue(connectionAtom);
  const [text, setText] = useState<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const { sendPrivateMessage } = useSendPrivateMessage((data, percentage) =>
    onPendingMessageProgressChange(data.id, percentage)
  );
  const { addToQueue } = useQueue(sendPrivateMessage, {
    onSuccess: () => {
      if (!chat) privateChatRefetch();
    },
  });

  useEffect(() => {
    if (replyMessage && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [replyMessage]);

  const sendMessage = async (value: string | File) => {
    const id = window.self.crypto.randomUUID();
    const isFileType = isFile(value);
    addToQueue({
      id,
      connectionId: connection.connectionId!,
      recipientId: recipient.id,
      replyToId: replyMessage?.id,
      ...(isFileType
        ? {
            type: MessageType.Image,
            file: value,
          }
        : {
            type: MessageType.Text,
            value: value,
          }),
    });
    onAddPendingMessage({
      id,
      chatId: chat?.id as string,
      authorId: currentUser.id,
      replyTo: replyMessage,
      createdAt: new Date().toISOString(),
      reactions: [],
      isPending: true,
      progressPercentage: 0,
      ...(isFileType
        ? {
            type: MessageType.Image,
            value: await fileToBase64(value),
          }
        : {
            type: MessageType.Text,
            value: value,
          }),
    });

    setText(null);
    setReplyMessage(null);
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
      <ChatNewMessageImage onSend={(image) => sendMessage(image!)} />
      <TextArea
        ref={fieldRef}
        size='small'
        onChange={setText}
        onFocus={() => !replyMessage && onScrollToBottom()}
        onKeyUp={onKeyUpThrottle}
        value={text ?? ''}
        sx={{ flexGrow: 1 }}
        InputProps={{ sx: { borderRadius: 3 } }}
      ></TextArea>
      <IconButton
        color='primary'
        disabled={!text}
        onClick={() => sendMessage(text!)}
        sx={{ ml: 1 }}
      >
        <Icon name='send' />
      </IconButton>
    </Stack>
  );
};
