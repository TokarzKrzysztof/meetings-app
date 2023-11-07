import { Outlet, useLocation } from 'react-router-dom';
import { Header } from 'src/components/Header/Header';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { MyProfileActionList } from 'src/pages/MyProfile/MyProfileActionList/MyProfileActionList';
import { MyProfileImage } from 'src/pages/MyProfile/MyProfileImage/MyProfileImage';
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
