import { useAtom } from 'jotai';
import _ from 'lodash';
import { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useQueue } from 'src/hooks/useQueue';
import { Chat } from 'src/models/chat/chat';
import { MessageType } from 'src/models/chat/message';
import { ChatNewMessageImage } from 'src/pages/chat/shared/components/ChatNewMessageImage';
import {
  ChatNewMessageReplyPreview,
  replyMessageAtom,
} from 'src/pages/chat/shared/components/ChatNewMessageReplyPreview';
import { ChatNewMessageVoice } from 'src/pages/chat/shared/components/ChatNewMessageVoice';
import { ChatSendBtn } from 'src/pages/chat/shared/components/ChatSendBtn';
import { MessageAction } from 'src/pages/chat/shared/reducers/message.reducer';
import { useSendMessage } from 'src/queries/chat-queries';
import { Box, Icon, IconButton, Stack, TextArea } from 'src/ui-components';
import { isBlob } from 'src/utils/file-utils';

export type ChatNewMessageProps = {
  chat: Chat | null | undefined;
  onScrollToBottom: () => void;
  onFirstPrivateMessageSend?: () => Promise<Chat>;
  dispatch: Dispatch<MessageAction>;
};

export const ChatNewMessage = ({
  chat,
  onScrollToBottom,
  onFirstPrivateMessageSend,
  dispatch,
}: ChatNewMessageProps) => {
  const currentUser = useLoggedInUser();
  const { startTyping } = useSignalRActions();
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);
  const [text, setText] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage } = useSendMessage((data, percentage) =>
    dispatch({ type: 'update-progress', id: data.id, percentage })
  );
  const { addToQueue } = useQueue(sendMessage);

  useEffect(() => {
    if (replyMessage && fieldRef.current) {
      fieldRef.current.focus();
    }
  }, [replyMessage]);

  const handleSend = async (value: string | Blob, type: MessageType) => {
    if (!chat) {
      chat = await onFirstPrivateMessageSend!();
    }
    const id = window.self.crypto.randomUUID();
    const isBlobType = isBlob(value);

    addToQueue({
      id,
      replyToId: replyMessage?.id,
      type,
      chatId: chat!.id,
      ...(isBlobType
        ? {
            file: value,
          }
        : {
            value: value,
          }),
    });
    dispatch({
      type: 'append',
      message: {
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
      <Stack position='relative' alignItems='flex-start' p={1}>
        {isRecording ? (
          <ChatNewMessageVoice
            onCancel={() => setIsRecording(false)}
            onSend={(blob) => {
              handleSend(blob, MessageType.Audio);
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
              <ChatNewMessageImage onSend={(image) => handleSend(image!, MessageType.Image)} />
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
            <ChatSendBtn onClick={() => handleSend(text!, MessageType.Text)} disabled={!text} />
          </>
        )}
      </Stack>
    </>
  );
};
