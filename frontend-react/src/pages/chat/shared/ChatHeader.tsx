import { ReactNode } from 'react';
import { useNavigateBack } from 'src/hooks/useNavigateBack';
import { AppBar, Button, Icon, Toolbar } from 'src/ui-components';

export type ChatHeaderProps = {
  right: ReactNode;
};

export const ChatHeader = ({ right }: ChatHeaderProps) => {
  const navigateBack = useNavigateBack();

  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          variant='text'
          startIcon={<Icon name='arrow_back' />}
          size='small'
          color='inherit'
          onClick={navigateBack}
        >
          Wróć
        </Button>
        {right}
      </Toolbar>
    </AppBar>
  );
};
