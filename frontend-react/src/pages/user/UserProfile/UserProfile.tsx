import { styled } from '@mui/material';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { UserProfileDescription } from 'src/pages/user/UserProfile/UserProfileDescription';
import { UserProfileImage } from 'src/pages/user/UserProfile/UserProfileImage';
import { UserProfileInterests } from 'src/pages/user/UserProfile/UserProfileInterests';
import { useGetUserProfile } from 'src/queries/user-profile-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Box, Container, Stack, Typography } from 'src/ui-components';
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
  const { userProfile, userProfileRefetch } = useGetUserProfile(params.userId);
  const { currentUser } = useGetCurrentUser();

  const isCurrentUser = !!userProfile && userProfile.user.id === currentUser?.id;

  if (!userProfile) return null;
  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <Container maxWidth='sm' sx={{ position: 'relative', py: 2 }}>
        <StyledTopBackground />
        <Stack direction={'column'} gap={1} alignItems={'center'}>
          <UserProfileImage imgSrc={userProfile.user.profileImageSrc} isEditable={isCurrentUser} />
          <Typography fontSize={19}>
            {userProfile.user.firstName} {userProfile.user.lastName}
          </Typography>
        </Stack>
        <UserProfileDescription
          userProfile={userProfile}
          isCurrentUser={isCurrentUser}
          onReload={userProfileRefetch}
        />
        <UserProfileInterests
          userProfile={userProfile}
          isCurrentUser={isCurrentUser}
          onReload={userProfileRefetch}
        />
      </Container>
    </>
  );
};

UserProfile.displayName = 'UserProfile';
