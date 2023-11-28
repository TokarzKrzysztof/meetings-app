import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SendBtn } from 'src/components/chat/ChatNewMessage/ChatNewMessage.shared';
import { ChatNewMessageImage } from 'src/components/chat/ChatNewMessage/ChatNewMessageImage/ChatNewMessageImage';
import { ChatNewMessageRecording } from 'src/components/chat/ChatNewMessage/ChatNewMessageRecording/ChatNewMessageRecording';
import {
  ChatNewMessageReplyPreview,
  replyMessageAtom,
} from 'src/components/chat/ChatNewMessage/ChatNewMessageReplyPreview/ChatNewMessageReplyPreview';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useQueue } from 'src/hooks/useQueue';
import { Chat } from 'src/models/chat/chat';
import { Message, MessageType } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { useSendPrivateMessage } from 'src/queries/chat-queries';
import { Box, Icon, IconButton, Stack, TextArea } from 'src/ui-components';
import { isBlob } from 'src/utils/file-utils';

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
  const [isRecording, setIsRecording] = useState(false);
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
    onAddPendingMessage({
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

  const transition = '300ms';
  const margin = 80;
  return (
    <>
      <ChatNewMessageReplyPreview />
      <Stack position={'relative'} alignItems={'flex-start'} p={1}>
        {isRecording ? (
          <ChatNewMessageRecording
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
            <SendBtn onClick={() => sendMessage(text!, MessageType.Text)} disabled={!text} />
          </>
        )}
      </Stack>
    </>
  );
};
