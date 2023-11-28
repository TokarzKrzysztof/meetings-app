import { Outlet, useLocation } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { MyProfileActionList } from 'src/pages/account/MyProfile/MyProfileActionList';
import { MyProfileImage } from 'src/pages/account/MyProfile/MyProfileImage';
import { Container, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyProfile = () => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  if (location.pathname === AppRoutes.MyProfile()) {
    return (
      <>
        <Header />
        <Container sx={{ pt: 4 }}>
          <Stack gap={3} alignItems='center'>
            <MyProfileImage currentUser={currentUser} />
            <Typography fontSize='large'>
              {currentUser.firstName} {currentUser.lastName}
            </Typography>
          </Stack>
          <MyProfileActionList />
        </Container>
      </>
    );
  }

  return <Outlet />;
};

MyProfile.displayName = 'MyProfile';
