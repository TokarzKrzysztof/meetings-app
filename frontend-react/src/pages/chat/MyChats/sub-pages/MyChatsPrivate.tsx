import { UserChatType } from 'src/models/chat/chat';
import { MyChatsItemCommonActions } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsItemCommonActions';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';

export const MyChatsPrivate = () => {
  return (
    <MyChatsList
      noChatsText='Brak prywatnych rozmów'
      type={UserChatType.Private}
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

MyChatsPrivate.displayName = 'MyChatsPrivate';
