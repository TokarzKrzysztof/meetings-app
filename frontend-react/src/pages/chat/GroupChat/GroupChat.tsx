import { useState } from 'react';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Message } from 'src/models/chat/message';
import { useGetGroupChat } from 'src/queries/chat-queries';
import { GroupChatParams } from 'src/utils/enums/app-routes';

export const GroupChat = () => {
  const [params] = useRouteParams<GroupChatParams>();
  const [messages, setMessages] = useState<Message[]>([]);

  const pageSize = 20;
  const { groupChat } = useGetGroupChat(params.chatId, pageSize, {
    onSuccess: (chat) => setMessages(chat.messages),
  });

  return <>{groupChat?.id}</>;
};

GroupChat.displayName = 'GroupChat';
