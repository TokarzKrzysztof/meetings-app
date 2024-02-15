import { ReactElement, ReactNode, useRef } from 'react';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { UserChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { List, Typography } from 'src/ui-components';

export type MyChatsListProps = {
  type: UserChatType;
  noChatsText: ReactNode;
  renderItem: (chat: ChatPreview, refetch: () => void) => ReactElement;
};

export const MyChatsList = ({ type, noChatsText, renderItem }: MyChatsListProps) => {
  const scrollableRef = useRef<HTMLUListElement>(null);
  const {
    currentUserChats,
    currentUserChatsFetchNextPage,
    currentUserChatsHasNextPage,
    currentUserChatsFetching,
    currentUserChatsRefetch,
  } = useGetCurrentUserChats(type);

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  // cannot be like this because ref will be null
  // if (!currentUserChats) return null;
  return (
    <>
      <List sx={{ overflow: 'auto' }} ref={scrollableRef}>
        <InfiniteScroll
          direction='down'
          next={currentUserChatsFetchNextPage}
          hasMore={!!currentUserChatsHasNextPage}
          isFetching={currentUserChatsFetching}
          scrollable={scrollableRef.current}
        >
          {(currentUserChats ?? []).map((x) => renderItem(x, currentUserChatsRefetch))}
        </InfiniteScroll>
        {currentUserChats && !currentUserChats.length && (
          <Typography mt={6} textAlign='center' color='grey'>
            {noChatsText}
          </Typography>
        )}
      </List>
    </>
  );
};
