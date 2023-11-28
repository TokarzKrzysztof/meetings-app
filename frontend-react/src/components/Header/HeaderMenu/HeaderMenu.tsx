import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { HeaderMenuAccountButton } from 'src/components/Header/HeaderMenuAccountButton/HeaderMenuAccountButton';
import { HeaderMenuMessages } from 'src/components/Header/HeaderMenuMessages/HeaderMenuMessages';
import { useDeviceMediaQuery } from 'src/hooks/useDeviceMediaQuery';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useLogout } from 'src/queries/auth-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Button } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuProps = {};

export const HeaderMenu = ({ ...props }: HeaderMenuProps) => {
  const { currentUser } = useGetCurrentUser();
  const confirm = useSetAtom(confirmationDialogAtom);
  const { isDesktop } = useDeviceMediaQuery();
  const { logout } = useLogout();

  const handleLogout = () => {
    confirm({
      message: 'Czy na pewno chcesz się wylogować?',
      onAccept: () => {
        logout(undefined, {
          onSuccess: () => {
            window.location.reload();
          },
        });
      },
    });
  };

  if (isDesktop && !currentUser) {
    return (
      <>
        <Button
          sx={{ textTransform: 'uppercase' }}
          color='inherit'
          variant='text'
          component={Link}
          to={AppRoutes.Login()}
        >
          Logowanie
        </Button>
        <Button
          sx={{ textTransform: 'uppercase' }}
          color='inherit'
          variant='text'
          component={Link}
          to={AppRoutes.Register()}
        >
          Rejestracja
        </Button>
      </>
    );
  }

  return (
    <>
      {currentUser && (
        <>
          {isDesktop && (
            <Button
              sx={{ mr: 2 }}
              color='inherit'
              variant='outlined'
              component={Link}
              to={AppRoutes.NewAnnouncement()}
            >
              Dodaj ogłoszenie
            </Button>
          )}
          <HeaderMenuMessages />
        </>
      )}
      <HeaderMenuAccountButton currentUser={currentUser} onLogout={handleLogout} />
    </>
  );
};
