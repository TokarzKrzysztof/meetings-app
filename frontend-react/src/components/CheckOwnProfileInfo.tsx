import { Link } from 'react-router-dom';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Button, Stack } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { LocalStorage } from 'src/utils/helpers/local-storage';

export type CheckOwnProfileInfoProps = {};

export const CheckOwnProfileInfo = ({ ...props }: CheckOwnProfileInfoProps) => {
  const { currentUser } = useGetCurrentUser();

  if (!currentUser || LocalStorage.getValue('hide-edit-profile-info')) return null;
  return (
    <Stack
      alignItems={'center'}
      p={1}
      sx={(theme) => ({ background: theme.palette.primary.light })}
    >
      Edytuj swój profil aby inni mogli dowiedzieć się więcej o Tobie!
      <Button
        size='small'
        variant='outlined'
        color='inherit'
        component={Link}
        to={AppRoutes.UserProfile({ userId: currentUser.id })}
      >
        Edytuj
      </Button>
    </Stack>
  );
};
