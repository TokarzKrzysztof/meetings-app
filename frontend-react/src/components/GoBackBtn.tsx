import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'src/ui-components';

export type GoBackBtnProps = PropsWithChildren<{
  to: string;
}>;

export const GoBackBtn = ({ to, children }: GoBackBtnProps) => {
  return (
    <Button
      variant='text'
      startIcon={<Icon name='arrow_back' />}
      size='small'
      component={Link}
      to={to}
      sx={{ mt: 1 }}
    >
      {children}
    </Button>
  );
};
