import { UserChatType } from 'src/models/chat/chat';
import { MyChatsItemCommonActions } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsItemCommonActions';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';

export const MyChatsGroup = () => {
  return (
    <MyChatsList
      noChatsText='Brak grupowych rozmów'
      type={UserChatType.Group}
      renderItem={(chat, refetch) => (
        <MyChatsListItem
          key={chat.id}
          chat={chat}
          menuItems={<MyChatsItemCommonActions chat={chat} onReload={refetch} />}
        />
      )}
    ></MyChatsList>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
