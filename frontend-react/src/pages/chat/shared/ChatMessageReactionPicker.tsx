import { Emoji } from 'emoji-picker-react';
import { EmojiPicker } from 'src/components/EmojiPicker';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { IconButton, Popover, Stack } from 'src/ui-components';

export type ChatMessageReactionPickerProps = {
  open: boolean;
  anchorEl: HTMLDivElement | null;
  message: Message;
  currentUser: User;
  onClose: () => void;
  onSelectReaction: (unified: string) => void;
};

export const ChatMessageReactionPicker = ({
  open,
  anchorEl,
  message,
  currentUser,
  onClose,
  onSelectReaction,
}: ChatMessageReactionPickerProps) => {
  const currentUserReaction = message.reactions.find((x) => x.authorId === currentUser.id);
  const suggestedReactions: string[] = ['1f44d', '1f602', '2764-fe0f', '1f62e', '1f620', '1f60a'];

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            gap: 1,
            borderRadius: 4,
            p: 1,
          },
        },
      }}
    >
      <Stack alignItems='center'>
        {suggestedReactions.map((unified) => (
          <IconButton
            key={unified}
            size='small'
            onClick={() => onSelectReaction(unified)}
            filled={unified === currentUserReaction?.unified}
          >
            <Emoji size={28} unified={unified}></Emoji>
          </IconButton>
        ))}
        <EmojiPicker
          buttonSize='small'
          onEmojiSelected={(emoji) => onSelectReaction(emoji.unified)}
          icon='add'
          closeOnSelect
        />
      </Stack>
    </Popover>
  );
};
