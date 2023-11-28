import { Icon, IconButton } from 'src/ui-components';

type SendBtnProps = {
  onClick: () => void;
  disabled?: boolean;
};
export const SendBtn = ({ onClick, disabled }: SendBtnProps) => {
  return (
    <IconButton color='primary' sx={{ ml: 1 }} onClick={onClick} disabled={disabled}>
      <Icon name='send' />
    </IconButton>
  );
};
