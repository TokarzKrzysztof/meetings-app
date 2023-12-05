import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useQueue } from 'src/hooks/useQueue';
import { Chat } from 'src/models/chat/chat';
import { Message, MessageType } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { ChatNewMessageImage } from 'src/pages/chat/shared/ChatNewMessageImage';
import {
  ChatNewMessageReplyPreview,
  replyMessageAtom,
} from 'src/pages/chat/shared/ChatNewMessageReplyPreview';
import { ChatNewMessageVoice } from 'src/pages/chat/shared/ChatNewMessageVoice';
import { ChatSendBtn } from 'src/pages/chat/shared/ChatSendBtn';
import { useSendPrivateMessage } from 'src/queries/chat-queries';
import { Box, Icon, IconButton, Stack, TextArea } from 'src/ui-components';
import { replaceItem } from 'src/utils/array-utils';
import { isBlob } from 'src/utils/file-utils';

export type ChatNewMessageProps = {
  recipient: User;
  chat: Chat | null | undefined;
  onScrollToBottom: () => void;
  setMessages: (value: React.SetStateAction<Message[]>) => void;
  onMessageSendSuccess?: () => void;
};

export const ChatNewMessage = ({
  recipient,
  chat,
  onScrollToBottom,
  setMessages,
  onMessageSendSuccess,
}: ChatNewMessageProps) => {
  const currentUser = useLoggedInUser();
  const { startTyping } = useSignalRActions();
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);
  const connection = useAtomValue(connectionAtom);
  const [text, setText] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const handlePendingMessageProgressChange = (id: Message['id'], progressPercentage: number) => {
    setMessages((prev) => {
      const item = prev.find((x) => x.id === id)!;
      item.progressPercentage = progressPercentage;
      replaceItem(prev, item);
      return [...prev];
    });
  };

  // TODO sendGroupMessage or simply SendMessage
  const { sendPrivateMessage } = useSendPrivateMessage((data, percentage) =>
    handlePendingMessageProgressChange(data.id, percentage)
  );
  const { addToQueue } = useQueue(sendPrivateMessage, {
    onSuccess: onMessageSendSuccess
  });

  useEffect(() => {
    if (replyMessage && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [replyMessage]);

  const sendMessage = async (value: string | Blob, type: MessageType) => {
    const id = window.self.crypto.randomUUID();
    const isBlobType = isBlob(value);

    addToQueue({
      id,
      connectionId: connection.connectionId!,
      recipientId: recipient.id,
      replyToId: replyMessage?.id,
      type,
      ...(isBlobType
        ? {
            file: value,
          }
        : {
            value: value,
          }),
    });
    setMessages((prev) => [
      ...prev,
      {
        id,
        chatId: chat?.id as string,
        authorId: currentUser.id,
        replyTo: replyMessage,
        createdAt: new Date().toISOString(),
        reactions: [],
        isPending: true,
        progressPercentage: 0,
        type,
        value: isBlobType ? URL.createObjectURL(value) : value,
      },
    ]);

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

  const transition = '300ms';
  const margin = 80;
  return (
    <>
      <ChatNewMessageReplyPreview />
      <Stack position={'relative'} alignItems={'flex-start'} p={1}>
        {isRecording ? (
          <ChatNewMessageVoice
            onCancel={() => setIsRecording(false)}
            onSend={(blob) => {
              sendMessage(blob, MessageType.Audio);
              setIsRecording(false);
            }}
          />
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                position: 'absolute',
                left: text ? -margin : 0,
                transition,
              }}
            >
              <ChatNewMessageImage onSend={(image) => sendMessage(image!, MessageType.Image)} />
              <IconButton onClick={() => setIsRecording(true)}>
                <Icon name='mic' />
              </IconButton>
            </Box>
            <TextArea
              ref={fieldRef}
              size='small'
              onChange={setText}
              onFocus={() => !replyMessage && onScrollToBottom()}
              onKeyUp={onKeyUpThrottle}
              value={text ?? ''}
              sx={{ flexGrow: 1, marginLeft: text ? 0 : `${margin}px`, transition }}
              InputProps={{ sx: { borderRadius: 3 } }}
            ></TextArea>
            <ChatSendBtn onClick={() => sendMessage(text!, MessageType.Text)} disabled={!text} />
          </>
        )}
      </Stack>
    </>
  );
};
