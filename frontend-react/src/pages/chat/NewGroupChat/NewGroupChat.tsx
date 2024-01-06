import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { NewGroupChatForm } from 'src/pages/chat/NewGroupChat/NewGroupChatForm';
import { NewGroupChatFormData } from 'src/pages/chat/NewGroupChat/new-group-chat-form-data';
import { useCreateGroupChat } from 'src/queries/chat-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const NewGroupChat = () => {
  const connection = useAtomValue(connectionAtom);
  const navigate = useNavigate();

  const { createGroupChat, createGroupChatInProgress } = useCreateGroupChat();

  const onSubmit = (data: NewGroupChatFormData) => {
    createGroupChat(
      {
        name: data.name,
        userIds: data.users.map((x) => x.id),
        connectionId: connection.connectionId!,
      },
      {
        onSuccess: (chatId) => {
          navigate(AppRoutes.GroupChat({ chatId, returnUrl: AppRoutes.MyChatsGroup() }));
        },
      }
    );
  };

  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <NewGroupChatForm onSubmit={onSubmit} inProgress={createGroupChatInProgress} />
    </>
  );
};

NewGroupChat.displayName = 'NewGroupChat';
