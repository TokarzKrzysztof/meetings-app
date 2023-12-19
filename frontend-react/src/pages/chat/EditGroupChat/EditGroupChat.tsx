import { useNavigate } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { GroupChatForm } from 'src/pages/chat/shared/components/GroupChatForm/GroupChatForm';
import { GroupChatFormData } from 'src/pages/chat/shared/components/GroupChatForm/group-chat-form-data';
import { useEditGroupChat, useGetGroupChat } from 'src/queries/chat-queries';
import { AppRoutes, EditGroupChatParams } from 'src/utils/enums/app-routes';

export const EditGroupChat = () => {
  const [params] = useRouteParams<EditGroupChatParams>();
  const navigate = useNavigate();

  const { groupChat } = useGetGroupChat(params.chatId);
  const { editGroupChat, editGroupChatInProgress } = useEditGroupChat();

  const onSubmit = (data: GroupChatFormData) => {
    editGroupChat(
      {
        id: params.chatId,
        name: data.name,
        userIds: data.users.map((x) => x.id),
      },
      {
        onSuccess: () => {
          navigate(
            AppRoutes.GroupChat({ chatId: params.chatId, returnUrl: AppRoutes.MyChatsGroup() })
          );
        },
      }
    );
  };

  if (!groupChat) return null;
  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <GroupChatForm
        onSubmit={onSubmit}
        title={'Edycja rozmowy grupowej'}
        inProgress={editGroupChatInProgress}
        buttonText={'Zapisz zmiany'}
        data={groupChat}
        disabledWhenUntouched
      />
    </>
  );
};

EditGroupChat.displayName = 'EditGroupChat';
