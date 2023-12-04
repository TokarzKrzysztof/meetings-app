import { useTheme } from '@mui/material';
import { atom } from 'jotai';
import { useEffect, useState } from 'react';
import { useClearableAtom } from 'src/hooks/useClearableAtom';
import { useDeferredFunction } from 'src/hooks/useDeferredFunction';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { ChatLoadingOldMessagesDialog } from 'src/pages/chat/shared/ChatLoadingOldMessagesDialog';
import { useLoadAllMessagesAfterDate } from 'src/queries/chat-queries';
import { getFocusableId } from 'src/utils/chat-utils';
import { PropsWithReactElement } from 'src/utils/types/props';

export const messageToFocusAtom = atom<Message | null>(null);

export type ChatMessageFocusProviderProps = PropsWithReactElement<{
  chat: Chat | null | undefined;
  setMessages: (value: React.SetStateAction<Message[]>) => void;
}>;

export const ChatMessageFocusProvider = ({ children, chat, setMessages }: ChatMessageFocusProviderProps) => {
  const theme = useTheme();
  const [messageToFocus, setMessageToFocus] = useClearableAtom(messageToFocusAtom);
  const [showLoadingOldMessagesDialog, setShowLoadingOldMessagesDialog] = useState(false);
  const { loadAllMessagesAfterDate } = useLoadAllMessagesAfterDate();

  const handleFocusRepliedMessageDeferred = useDeferredFunction((repliedMessage: Message) => {
    handleFocusRepliedMessage(repliedMessage);
  });

  useEffect(() => {
    if (messageToFocus) {
      handleFocusRepliedMessage(messageToFocus);
    }
    return () => setMessageToFocus(null);
  }, [messageToFocus]);

  const animateMessage = (element: HTMLElement) => {
    element.style.boxShadow = `0px 0px 0px 1px ${theme.palette.primary.main}`;
    element.style.transition = 'box-shadow 400ms';
    setTimeout(() => {
      element.style.boxShadow = '';
      element.style.transition = '';
    }, 1000);
  };

  const handleFocusRepliedMessage = (repliedMessage: Message) => {
    const element = document.getElementById(getFocusableId(repliedMessage.id))!;
    if (element) {
      element.scrollIntoView({ block: 'center' });
      animateMessage(element);
    } else {
      setShowLoadingOldMessagesDialog(true);
      loadAllMessagesAfterDate(
        {
          chatId: chat!.id,
          afterDate: repliedMessage.createdAt,
        },
        {
          onSuccess: (data) => {
            setMessages(data);
            handleFocusRepliedMessageDeferred(repliedMessage);
            setShowLoadingOldMessagesDialog(false);
          },
        }
      );
    }
  };

  return (
    <>
      {children}
      {showLoadingOldMessagesDialog && (
        <ChatLoadingOldMessagesDialog onClose={() => setShowLoadingOldMessagesDialog(false)} />
      )}
    </>
  );
};
