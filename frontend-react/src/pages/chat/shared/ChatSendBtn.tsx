import { Icon, IconButton } from 'src/ui-components';

export type ChatSendBtnProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const ChatSendBtn = ({ onClick, disabled }: ChatSendBtnProps) => {
  return (
    <IconButton color='primary' sx={{ ml: 1 }} onClick={onClick} disabled={disabled}>
      <Icon name='send' />
    </IconButton>
  );
};
