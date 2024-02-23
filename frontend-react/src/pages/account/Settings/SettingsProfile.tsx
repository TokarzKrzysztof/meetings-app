import { Outlet, useLocation } from 'react-router-dom';
import { PageTitle } from 'src/components/PageTitle';
import { Header } from 'src/components/header/Header';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { SettingsActionList } from 'src/pages/account/Settings/SettingsActionList';
import { Container } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const Settings = () => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  if (location.pathname === AppRoutes.Settings()) {
    return (
      <>
        <Header />
        <Container>
          <PageTitle>Ustawienia konta</PageTitle>
          <SettingsActionList currentUser={currentUser} />
        </Container>
      </>
    );
  }

  return <Outlet />;
};

Settings.displayName = 'Settings';
