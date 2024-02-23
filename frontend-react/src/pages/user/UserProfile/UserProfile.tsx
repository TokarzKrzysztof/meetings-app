import { styled } from '@mui/material';
import { useEffect } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { UserProfileActions } from 'src/pages/user/UserProfile/UserProfileActions';
import { UserProfileBasicData } from 'src/pages/user/UserProfile/UserProfileBasicData';
import { UserProfileDescription } from 'src/pages/user/UserProfile/UserProfileDescription';
import { UserProfileImage } from 'src/pages/user/UserProfile/UserProfileImage';
import { UserProfileInterests } from 'src/pages/user/UserProfile/UserProfileInterests';
import { useGetUserProfile } from 'src/queries/user-profile-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Box, Container, Stack, Typography } from 'src/ui-components';
import { UserProfileParams } from 'src/utils/enums/app-routes';
import { LocalStorage } from 'src/utils/helpers/local-storage';

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
  const [params] = useRouteParams<UserProfileParams>();
  const { userProfile, userProfileFetching, userProfileRefetch } = useGetUserProfile(params.userId);
  const { currentUser } = useGetCurrentUser();

  const isCurrentUser = !!userProfile && userProfile.user.id === currentUser?.id;

  useEffect(() => {
    if (isCurrentUser && !LocalStorage.getValue('hide-edit-profile-info')) {
      LocalStorage.setValue('hide-edit-profile-info', true);
    }
  }, [isCurrentUser]);

  if (!userProfile || userProfileFetching) return null;
  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <Container maxWidth='sm' sx={{ position: 'relative' }}>
        <StyledTopBackground />
        <Stack direction={'column'} gap={1} alignItems={'center'}>
          <UserProfileImage
            imgSrc={userProfile.user.profileImageSrc}
            isCurrentUser={isCurrentUser}
          />
          <Typography fontSize={19}>
            {userProfile.user.firstName} {userProfile.user.lastName}
          </Typography>
        </Stack>
        {!isCurrentUser && (
          <Box mt={2}>
            <UserProfileActions userProfile={userProfile} isLoggedIn={!!currentUser} />
          </Box>
        )}
        <Box mt={2}>
          <UserProfileBasicData userProfile={userProfile} isCurrentUser={isCurrentUser} />
        </Box>
        <Box mt={2}>
          <UserProfileDescription
            userProfile={userProfile}
            isCurrentUser={isCurrentUser}
            onReload={userProfileRefetch}
          />
        </Box>
        <Box mt={2}>
          <UserProfileInterests
            userProfile={userProfile}
            isCurrentUser={isCurrentUser}
            onReload={userProfileRefetch}
          />
        </Box>
      </Container>
    </>
  );
};

UserProfile.displayName = 'UserProfile';
