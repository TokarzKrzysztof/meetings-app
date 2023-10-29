import { Message } from 'src/models/conversation/message';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Chip, Stack } from 'src/ui-components';

export type ConversationMessagesProps = {
  messages: Message[];
};

export const ConversationMessages = ({ messages }: ConversationMessagesProps) => {
  const { currentUser } = useGetCurrentUser();

  return (
    <Stack direction={'column'} py={1} gap={1}>
      {messages.map((x) => {
        const isAuthorCurrentUser = x.authorId === currentUser?.id;
        return (
          <Chip
            key={x.id}
            variant={isAuthorCurrentUser ? 'outlined' : 'filled'}
            label={x.text}
            sx={{
              height: 'auto',
              maxWidth: 400,
              alignSelf: isAuthorCurrentUser ? 'flex-end' : 'flex-start',
              ...(isAuthorCurrentUser ? { marginLeft: '20px' } : { marginRight: '20px' }),
              p: 1,
              fontSize: 14,
              '& .MuiChip-label': {
                p: 0,
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              },
            }}
          />
        );
      })}
    </Stack>
  );
};
