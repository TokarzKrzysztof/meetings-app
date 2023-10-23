import { SnackbarKey, useSnackbar } from 'notistack';
import { Icon, IconButton } from 'src/ui-components';

export type SnackbarCloseButtonProps = {
  snackbarKey: SnackbarKey;
};

export const SnackbarCloseButton = ({ snackbarKey }: SnackbarCloseButtonProps) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)} color='inherit'>
      <Icon name='close' />
    </IconButton>
  );
};
