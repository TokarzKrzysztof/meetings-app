import { Outlet, useLocation } from 'react-router-dom';
import { PageTitle } from 'src/components/PageTitle';
import { Header } from 'src/components/header/Header';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { MyProfileActionList } from 'src/pages/account/MyProfile/MyProfileActionList';
import { Container } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyProfile = () => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  if (location.pathname === AppRoutes.MyProfile()) {
    return (
      <>
        <Header />
        <Container>
          <PageTitle>Ustawienia konta</PageTitle>
          <MyProfileActionList currentUser={currentUser} />
        </Container>
      </>
    );
  }

  return <Outlet />;
};

MyProfile.displayName = 'MyProfile';
