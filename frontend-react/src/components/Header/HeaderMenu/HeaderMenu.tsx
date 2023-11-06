import { useSetAtom } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderMenuAccountButton } from 'src/components/Header/HeaderMenu/HeaderMenuAccountButton/HeaderMenuAccountButton';
import { useDeviceMediaQuery } from 'src/hooks/useDeviceMediaQuery';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useLogout } from 'src/queries/auth-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Button, Icon, IconButton } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuProps = {};

export const HeaderMenu = ({ ...props }: HeaderMenuProps) => {
  const { setCurrentUser } = useSetQueryData();
  const { currentUser } = useGetCurrentUser();
  const confirm = useSetAtom(confirmationDialogAtom);
  const { isDesktop } = useDeviceMediaQuery();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirm({
      message: 'Czy na pewno chcesz się wylogować?',
      onAccept: () => {
        logout(undefined, {
          onSuccess: () => {
            setCurrentUser(null);
            navigate(AppRoutes.Home());
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
          <IconButton size='large' slot='end' color='inherit'>
            <Icon name='question_answer' />
          </IconButton>
        </>
      )}
      <HeaderMenuAccountButton currentUser={currentUser} onLogout={handleLogout} />
    </>
  );
};
