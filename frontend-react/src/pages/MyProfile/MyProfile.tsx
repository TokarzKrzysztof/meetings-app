import { Header } from 'src/components/Header/Header';
import { MyProfileImage } from 'src/pages/MyProfile/MyProfileImage/MyProfileImage';
import { useGetCurrentUser } from 'src/queries/user-queries';
import {
  Container,
  Stack,
  Typography
} from 'src/ui-components';

export const MyProfile = () => {
  const { currentUser } = useGetCurrentUser();

  if (!currentUser) return null;
  return (
    <>
      <Header />
      <Container sx={{ pt: 4 }}>
        <Stack gap={3} alignItems={'center'}>
          <MyProfileImage />
          <Typography fontSize={'large'}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

MyProfile.displayName = 'MyProfile';
