import { useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AvatarList } from 'src/components/AvatarList';
import { useClearableAtom } from 'src/hooks/useClearableAtom';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { GroupChatAloneInfo } from 'src/pages/chat/GroupChat/GroupChatAloneInfo';
import { GroupChatParticipantsPreview } from 'src/pages/chat/GroupChat/GroupChatParticipantsPreview';
import { chatAtom } from 'src/pages/chat/shared/atoms/chat-atom';
import { ChatHeader } from 'src/pages/chat/shared/components/ChatHeader';
import { ChatNewMessage } from 'src/pages/chat/shared/components/ChatNewMessage';
import { ChatScrollable, ChatScrollableHandle } from 'src/pages/chat/shared/components/ChatScrollable';
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
  const anchorRef = useRef<HTMLDivElement>(null);
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [showParticipantsPreview, setShowParticipantsPreview] = useState(false);
  const [showAloneInfo, setShowAloneInfo] = useState(false);
  const [_, setChat] = useClearableAtom(chatAtom);
  const currentUser = useLoggedInUser();
  const navigate = useNavigate();

  const { groupChat } = useGetGroupChat(params.chatId, {
    onSuccess: (chat) => {
      setChat(chat);
      if (chat.participants.length === 1) {
        setShowAloneInfo(true);
      }
    },
    onError: (err) => {
      if (err.response?.data.validationErrors.includes('NotInChat')) {
        navigate(AppRoutes.MyChatsGroup());
      }
    },
  });

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
              <Stack
                ref={anchorRef}
                alignItems='center'
                gap={1}
                onClick={() => !isAloneInChat && setShowParticipantsPreview(true)}
              >
                <AvatarList users={groupChat.participants} avatarSize={30} />
                <Typography>{groupChat.name}</Typography>
              </Stack>
            }
          />
          <ChatScrollable
            ref={scrollableRef}
            top={
              <Stack flexDirection='column' alignItems='center' mt='auto'>
                <AvatarList users={groupChat.participants} avatarSize={50} sx={{ mb: 2 }} />
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
      {showParticipantsPreview && (
        <GroupChatParticipantsPreview
          anchorEl={anchorRef.current}
          onClose={() => setShowParticipantsPreview(false)}
          groupChat={groupChat}
        />
      )}
      {showAloneInfo && (
        <GroupChatAloneInfo onClose={() => setShowAloneInfo(false)} groupChat={groupChat} />
      )}
    </>
  );
};

GroupChat.displayName = 'GroupChat';
