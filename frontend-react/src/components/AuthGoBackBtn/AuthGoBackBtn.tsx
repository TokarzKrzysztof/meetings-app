import { Button, Icon, Link } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type AuthGoBackBtnProps = {};

export const AuthGoBackBtn = ({ ...props }: AuthGoBackBtnProps) => {
  return (
    <Button
      sx={{ color: 'white' }}
      variant='text'
      startIcon={<Icon name='arrow_back' />}
      size='small'
      component={Link}
      to={AppRoutes.Home}
    >
      Powrót
    </Button>
  );
};
