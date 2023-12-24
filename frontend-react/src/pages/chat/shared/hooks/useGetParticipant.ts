import { Chat } from 'src/models/chat/chat';
import { User } from 'src/models/user';
import { useGetUser } from 'src/queries/user-queries';

export const useGetParticipant = (chat: Chat, id: User['id']) => {
  const participant = chat.participants.find((x) => x.id === id);

  // load user in case participant is not present in chat anymore
  const { user } = useGetUser(id, {
    enabled: !participant,
  });

  return participant ?? user;
};
