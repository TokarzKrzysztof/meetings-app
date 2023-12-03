import { useMemo, useState } from 'react';
import { ChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MyChatsTabsCreateNew } from 'src/pages/chat/MyChats/MyChatsTabsCreateNew';
import { MyChatsTabsListItem } from 'src/pages/chat/MyChats/MyChatsTabsListItem';
import { MyChatsTabsPanel } from 'src/pages/chat/MyChats/MyChatsTabsPanel';
import { Stack, Tab, Tabs } from 'src/ui-components';

export type MyChatsTabsProps = {
  currentUserChats: ChatPreview[];
};

export const MyChatsTabs = ({ currentUserChats }: MyChatsTabsProps) => {
  const [selectedTab, setSelectedTab] = useState<ChatType>(ChatType.Private);

  const chats = useMemo(() => {
    return {
      private: currentUserChats.filter((x) => x.chatType === ChatType.Private),
      group: currentUserChats.filter((x) => x.chatType === ChatType.Group),
    };
  }, [currentUserChats]);

  return (
    <>
      <Stack justifyContent={'space-between'} alignItems={'center'} pr={1}>
        <Tabs
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
        >
          <Tab label='Prywatne' />
          <Tab label='Grupowe' />
        </Tabs>
        <MyChatsTabsCreateNew />
      </Stack>
      {selectedTab === ChatType.Private && (
        <MyChatsTabsPanel noChatsText={'Brak prywatnych rozmów'}>
          {chats.private.map((chat) => (
            <MyChatsTabsListItem key={chat.id} chat={chat} />
          ))}
        </MyChatsTabsPanel>
      )}
      {selectedTab === ChatType.Group && (
        <MyChatsTabsPanel noChatsText={'Brak grupowych rozmów'}>
          {chats.group.map((chat) => (
            <MyChatsTabsListItem key={chat.id} chat={chat} />
          ))}
        </MyChatsTabsPanel>
      )}
    </>
  );
};
