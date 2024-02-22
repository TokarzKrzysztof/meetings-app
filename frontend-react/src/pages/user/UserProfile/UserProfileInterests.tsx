import { useState } from 'react';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileCard } from 'src/pages/user/UserProfile/UserProfileCard';
import { UserProfileInterestsEdit } from 'src/pages/user/UserProfile/UserProfileInterestsEdit';
import { Chip, Stack, Typography } from 'src/ui-components';

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
      <UserProfileCard
        title='Zainteresowania'
        onEdit={() => setIsEditMode(true)}
        showEditButton={isCurrentUser}
      >
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
      </UserProfileCard>
      <UserProfileInterestsEdit
        open={isEditMode}
        userProfile={userProfile}
        onClose={() => setIsEditMode(false)}
        onReload={onReload}
      />
    </>
  );
};
