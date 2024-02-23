import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvatarList } from 'src/components/AvatarList';
import { useSetClearableAtom } from 'src/hooks/useClearableAtom';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { GroupChatActions } from 'src/pages/chat/GroupChat/GroupChatActions';
import { GroupChatAloneInfo } from 'src/pages/chat/GroupChat/GroupChatAloneInfo';
import { GroupChatChangeName } from 'src/pages/chat/GroupChat/GroupChatChangeName';
import { GroupChatParticipants } from 'src/pages/chat/GroupChat/GroupChatParticipants';
import { chatAtom } from 'src/pages/chat/shared/atoms/chat-atom';
import { ChatHeader } from 'src/pages/chat/shared/components/ChatHeader';
import { ChatNewMessage } from 'src/pages/chat/shared/components/ChatNewMessage';
import {
    ChatScrollable,
    ChatScrollableHandle,
} from 'src/pages/chat/shared/components/ChatScrollable';
import { useSignalRListeners } from 'src/pages/chat/shared/hooks/useSignalRListeners';
import { useUnloadListener } from 'src/pages/chat/shared/hooks/useUnloadListener';
import { ChatMessageFocusProvider } from 'src/pages/chat/shared/providers/ChatMessageFocusProvider';
import { messageReducer } from 'src/pages/chat/shared/reducers/message.reducer';
import { useGetGroupChat } from 'src/queries/chat-queries';
import { Stack, Typography } from 'src/ui-components';
import { AppRoutes, GroupChatParams } from 'src/utils/enums/app-routes';

export const GroupChat = () => {
  const [params] = useRouteParams<GroupChatParams>();
  const scrollableRef = useRef<ChatScrollableHandle>(null);
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [showAloneInfoDialog, setShowAloneInfoDialog] = useState(false);
  const [showChangeNameDialog, setShowChangeNameDialog] = useState(false);
  const setChat = useSetClearableAtom(chatAtom);
  const currentUser = useLoggedInUser();
  const navigate = useNavigate();

  const { groupChat, groupChatRefetch, groupChatFetchedAfterMount } = useGetGroupChat(
    params.chatId,
    {
      onSuccess: (chat) => setChat(chat),
      onError: (err) => {
        if (err.response?.data.validationErrors.includes('NotInChat')) {
          navigate(AppRoutes.MyChatsGroup());
        }
      },
    }
  );

  useEffect(() => {
    if (groupChat?.participants.length === 1) {
      setShowAloneInfoDialog(true);
    }
  }, [groupChatFetchedAfterMount]);

  useSignalRListeners(groupChat, dispatch);
  useUnloadListener(messages);

  const isAloneInChat = groupChat?.participants.length === 1;

  const participantNames = useMemo(() => {
    if (!groupChat) return '';
    if (isAloneInChat) return 'Tylko Ty';

    const others = groupChat.participants
      .filter((x) => x.id !== currentUser.id)
      .map((x) => x.firstName);
    return ['Ty', ...others].join(', ');
  }, [groupChat, isAloneInChat]);

  if (!groupChat) return null;
  return (
    <>
      <ChatMessageFocusProvider chat={groupChat} dispatch={dispatch}>
        <Stack height='100vh' direction='column'>
          <ChatHeader
            returnUrl={params.returnUrl}
            right={
              <Stack alignItems='center' gap={1}>
                <AvatarList users={groupChat.participants} avatarSize={'small'} />
                <Typography>{groupChat.name}</Typography>
                <GroupChatActions
                  groupChat={groupChat}
                  onShowParticipantsDialog={() => setShowParticipantsDialog(true)}
                  onShowChangeNameDialog={() => setShowChangeNameDialog(true)}
                />
              </Stack>
            }
          />
          <ChatScrollable
            ref={scrollableRef}
            top={
              <Stack flexDirection='column' alignItems='center' mt='auto'>
                <AvatarList users={groupChat.participants} avatarSize={'large'} sx={{ mb: 2 }} />
                <Typography>{groupChat.name}</Typography>
                <Typography textAlign='center' color='grey'>
                  {participantNames}
                </Typography>
              </Stack>
            }
            messages={messages}
            dispatch={dispatch}
            chat={groupChat}
          />
          <ChatNewMessage
            onScrollToBottom={() => scrollableRef.current?.scrollToBottom('smooth')}
            chat={groupChat}
            dispatch={dispatch}
          />
        </Stack>
      </ChatMessageFocusProvider>
      {showParticipantsDialog && (
        <GroupChatParticipants
          onReload={groupChatRefetch}
          onClose={() => setShowParticipantsDialog(false)}
          groupChat={groupChat}
        />
      )}
      {showChangeNameDialog && (
        <GroupChatChangeName
          onReload={groupChatRefetch}
          onClose={() => setShowChangeNameDialog(false)}
          groupChat={groupChat}
        />
      )}
      {showAloneInfoDialog && (
        <GroupChatAloneInfo
          onOpenParticipantsDialog={() => {
            setShowAloneInfoDialog(false);
            setShowParticipantsDialog(true);
          }}
          onClose={() => setShowAloneInfoDialog(false)}
        />
      )}
    </>
  );
};

GroupChat.displayName = 'GroupChat';
