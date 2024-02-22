import { useState } from 'react';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileInterestsEdit } from 'src/pages/user/UserProfile/UserProfileInterestsEdit';
import { Box, Button, Card, Chip, Icon, Stack, Typography } from 'src/ui-components';

export type UserProfileInterestsProps = {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  onReload: () => void;
};

export const UserProfileInterests = ({
  userProfile,
  isCurrentUser,
  onReload,
}: UserProfileInterestsProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <Box mt={2}>
        <Card sx={{ pt: 2, pl: 2, pb: 1, pr: 1 }}>
          <Typography mb={2} color={'grey'}>
            Zainteresowania
          </Typography>
          <Stack gap={1} flexWrap={'wrap'}>
            {userProfile.interests.length ? (
              userProfile.interests.map((x) => <Chip key={x} label={x} />)
            ) : (
              <Typography fontStyle={'italic'} sx={{ opacity: 0.5 }}>
                {isCurrentUser
                  ? 'Nie wybrałeś żadnych zainteresowań'
                  : 'Użytkownik nie wybrał żadnych zainteresowań'}
              </Typography>
            )}
          </Stack>
          {isCurrentUser && (
            <Box mt={1} textAlign={'right'}>
              <Button
                variant='text'
                size='small'
                startIcon={<Icon name='edit'></Icon>}
                onClick={() => setIsEditMode(true)}
              >
                Edytuj
              </Button>
            </Box>
          )}
        </Card>
      </Box>
      <UserProfileInterestsEdit
        open={isEditMode}
        userProfile={userProfile}
        onClose={() => setIsEditMode(false)}
        onReload={onReload}
      />
    </>
  );
};
