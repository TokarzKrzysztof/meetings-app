import { useAtomValue } from 'jotai';
import { useSignalRActions } from 'src/hooks/signalR/useSignalRActions';
import { Message } from 'src/models/chat/message';
import { chatAtom } from 'src/pages/chat/shared/atoms/chat-atom';
import { ChatMessageContentReactionsPreviewItem } from 'src/pages/chat/shared/components/ChatMessageContentReactionsPreviewItem';
import { List, Popover } from 'src/ui-components';

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

  const handleRemove = (unified: string) => {
    setMessageReaction({
      messageId: message.id,
      reactionUnified: unified,
    });
    onClose();
  };

  return (
    <Popover
      open
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <List>
        {message.reactions.map((reaction) => (
          <ChatMessageContentReactionsPreviewItem
            key={reaction.id}
            reaction={reaction}
            onRemove={() => handleRemove(reaction.unified)}
            chat={chat!}
          />
        ))}
      </List>
    </Popover>
  );
};
