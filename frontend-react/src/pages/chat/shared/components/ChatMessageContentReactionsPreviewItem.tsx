import { Emoji } from 'emoji-picker-react';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { MessageReaction } from 'src/models/chat/message-reaction';
import { useGetParticipant } from 'src/pages/chat/shared/hooks/useGetParticipant';
import {
    Avatar,
    Icon,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
} from 'src/ui-components';

export type ChatMessageContentReactionsPreviewItemProps = {
  reaction: MessageReaction;
  chat: Chat;
  onRemove: () => void;
};
export const ChatMessageContentReactionsPreviewItem = ({
  reaction,
  chat,
  onRemove,
}: ChatMessageContentReactionsPreviewItemProps) => {
  const currentUser = useLoggedInUser();
  const author = useGetParticipant(chat, reaction.authorId);
  const isAuthorCurrentUser = author?.id === currentUser.id;

  if (!author) return null;
  return (
    <ListItem
      key={reaction.id}
      secondaryAction={
        <Stack spacing={1} alignItems='center'>
          {isAuthorCurrentUser && (
            <IconButton size='small' onClick={onRemove}>
              <Icon name='delete'></Icon>
            </IconButton>
          )}
          <Emoji size={28} unified={reaction.unified}></Emoji>
        </Stack>
      }
      sx={{ minWidth: 300 }}
    >
      <ListItemAvatar sx={{ minWidth: 'auto', mr: 1 }}>
        <Avatar size={30} src={author.profileImageSrc}></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={isAuthorCurrentUser ? 'Ty' : `${author.firstName} ${author.lastName}`}
      />
    </ListItem>
  );
};
