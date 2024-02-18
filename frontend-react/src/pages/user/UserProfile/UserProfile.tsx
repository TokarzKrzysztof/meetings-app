import { styled } from '@mui/material';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { useGetUser } from 'src/queries/user-queries';
import { Avatar, Box, Card, CardContent, Container, Stack, Typography } from 'src/ui-components';
import { UserProfileParams } from 'src/utils/enums/app-routes';

const StyledTopBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: -1,
  height: 80,
  top: 0,
  left: 0,
  right: 0,
  background: theme.palette.grey[100],
}));

export const UserProfile = () => {
  const params = useRouteParams<UserProfileParams>();
  const { user } = useGetUser(params.id);

  if (!user) return null;
  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <Container maxWidth='sm' sx={{ position: 'relative', pt: 2 }}>
        <StyledTopBackground />
        <Stack direction={'column'} gap={1} alignItems={'center'}>
          <Avatar src={user.profileImageSrc} size={90} />
          <Typography fontSize={19}>
            {user.firstName} {user.lastName}
          </Typography>
        </Stack>
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ minWidth: 250 }}>
            {/* <Typography variant='h6' mb={1} component='div'>
              Opis
            </Typography> */}
            <Typography fontSize={14}>
              Cześć! <br /> Jestem Kasia Masia <br /> i lubię Stasia
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ minWidth: 250 }}>Piłka nożna, football</CardContent>
        </Card>
      </Container>
    </>
  );
};

UserProfile.displayName = 'UserProfile';
