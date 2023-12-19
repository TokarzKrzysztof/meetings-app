import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { GroupChatForm } from 'src/pages/chat/shared/components/GroupChatForm/GroupChatForm';
import { GroupChatFormData } from 'src/pages/chat/shared/components/GroupChatForm/group-chat-form-data';
import { useCreateGroupChat } from 'src/queries/chat-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const NewGroupChat = () => {
  const connection = useAtomValue(connectionAtom);
  const navigate = useNavigate();

  const { createGroupChat, createGroupChatInProgress } = useCreateGroupChat();

  const onSubmit = (data: GroupChatFormData) => {
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
      <GroupChatForm
        onSubmit={onSubmit}
        title={'Nowa rozmowa grupowa'}
        inProgress={createGroupChatInProgress}
        buttonText={'Utwórz rozmowę grupową'}
      />
    </>
  );
};

NewGroupChat.displayName = 'NewGroupChat';
