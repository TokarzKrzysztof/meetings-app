import { Emoji } from 'emoji-picker-react';
import { useAtomValue } from 'jotai';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Message } from 'src/models/chat/message';
import { chatAtom } from 'src/pages/chat/shared/atoms/chat-atom';
import {
  Avatar,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Stack,
} from 'src/ui-components';

export type ChatMessageContentReactionsPreviewProps = {
  anchorEl: HTMLDivElement | null;
  message: Message;
  onClose: () => void;
};
export const ChatMessageContentReactionsPreview = ({
  anchorEl,
  message,
  onClose,
}: ChatMessageContentReactionsPreviewProps) => {
  const { setMessageReaction } = useSignalRActions();
  const chat = useAtomValue(chatAtom);
  const currentUser = useLoggedInUser();

  const handleRemove = (unified: string) => {
    setMessageReaction({
      messageId: message.id,
      reactionUnified: unified,
    });
    onClose();
  };

  return (
    <Popover open anchorEl={anchorEl} onClose={onClose}>
      <List>
        {message.reactions.map((reaction) => {
          const author = chat!.participants.find((x) => x.id === reaction.authorId)!;
          const isAuthorCurrentUser = author.id === currentUser.id;
          return (
            <ListItem
              key={reaction.id}
              secondaryAction={
                <Stack spacing={1} alignItems='center'>
                  {isAuthorCurrentUser && (
                    <IconButton size='small' onClick={() => handleRemove(reaction.unified)}>
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
        })}
      </List>
    </Popover>
  );
};
