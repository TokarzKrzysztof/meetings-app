import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationText } from 'src/components/LocationText';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { useClearableAtom } from 'src/hooks/useClearableAtom';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { Chat } from 'src/models/chat/chat';
import { User } from 'src/models/user';
import { PrivateChatReplyToAnnouncementInfo } from 'src/pages/chat/PrivateChat/PrivateChatReplyToAnnouncementInfo';
import { chatAtom } from 'src/pages/chat/shared/atoms/chat-atom';
import { ChatHeader } from 'src/pages/chat/shared/components/ChatHeader';
import { ChatNewMessage } from 'src/pages/chat/shared/components/ChatNewMessage';
import {
  ChatScrollable,
  ChatScrollableHandle,
} from 'src/pages/chat/shared/components/ChatScrollable';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/components/UserActiveStatusBadge';
import { useSignalRListeners } from 'src/pages/chat/shared/hooks/useSignalRListeners';
import { useUnloadListener } from 'src/pages/chat/shared/hooks/useUnloadListener';
import { ChatMessageFocusProvider } from 'src/pages/chat/shared/providers/ChatMessageFocusProvider';
import { messageReducer } from 'src/pages/chat/shared/reducers/message.reducer';
import { useGetAnnouncement } from 'src/queries/announcement-queries';
import { useCreatePrivateChat, useGetPrivateChat } from 'src/queries/chat-queries';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Stack, Typography } from 'src/ui-components';
import { AppRoutes, PrivateChatParams } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export const PrivateChat = () => {
  const [params] = useRouteParams<PrivateChatParams>();
  const scrollableRef = useRef<ChatScrollableHandle>(null);
  const [messages, dispatch] = useReducer(messageReducer, []);
  const { user } = useGetUser(params.userId);
  const { announcement } = useGetAnnouncement(params.announcementId!, {
    enabled: !!params.announcementId,
    staleTime: Infinity,
  });
  const connection = useAtomValue(connectionAtom);
  const setChat = useClearableAtom(chatAtom)[1];

  const { privateChat, privateChatFetching } = useGetPrivateChat(params.userId, {
    onSuccess: (chat) => setChat(chat),
  });
  const { createPrivateChat } = useCreatePrivateChat();
  const { setPrivateChat } = useSetQueryData();

  useParticipantValidator(user);
  useSignalRListeners(privateChat, dispatch);
  useUnloadListener(messages);

  const handleCreatePrivateChat = () => {
    return new Promise<Chat>((resolve) => {
      createPrivateChat(
        {
          participantId: user!.id,
          connectionId: connection.connectionId!,
        },
        {
          onSuccess: (chat) => {
            resolve(chat);
            setPrivateChat(chat);
          },
        }
      );
    });
  };

  const age = useMemo(() => (user ? calculateAge(user.birthDate) : null), [user]);

  if (!user || privateChatFetching) return null;
  return (
    <ChatMessageFocusProvider chat={privateChat} dispatch={dispatch}>
      <Stack height='100vh' direction='column'>
        <ChatHeader
          right={
            <Stack alignItems='center' gap={1}>
              <UserActiveStatusBadge status={user.activeStatus}>
                <Avatar src={user.profileImageSrc} size={30} />
              </UserActiveStatusBadge>
              <Typography>
                {user.firstName} {user.lastName}
              </Typography>
            </Stack>
          }
        />

        <ChatScrollable
          ref={scrollableRef}
          top={
            <Stack flexDirection='column' alignItems='center' mt='auto'>
              <Avatar src={user.profileImageSrc} size={100} sx={{ mb: 2 }} />
              <Typography>
                {user.firstName} {user.lastName}, {age}
              </Typography>
              <LocationText locationId={user.locationId} />
            </Stack>
          }
          messages={messages}
          dispatch={dispatch}
          chat={privateChat}
        />
        {announcement && (
          <PrivateChatReplyToAnnouncementInfo description={announcement.description} />
        )}
        <ChatNewMessage
          onScrollToBottom={() => scrollableRef.current?.scrollToBottom('smooth')}
          chat={privateChat}
          onFirstPrivateMessageSend={handleCreatePrivateChat}
          dispatch={dispatch}
        />
      </Stack>
    </ChatMessageFocusProvider>
  );
};

const useParticipantValidator = (participant: User | undefined) => {
  const currentUser = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && participant && currentUser.id === participant.id) {
      navigate(AppRoutes.Home());
    }
  }, [currentUser, participant]);
};

PrivateChat.displayName = 'PrivateChat';
