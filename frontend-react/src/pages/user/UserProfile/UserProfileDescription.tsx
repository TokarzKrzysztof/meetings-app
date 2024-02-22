import { useState } from 'react';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileCard } from 'src/pages/user/UserProfile/UserProfileCard';
import { UserProfileDescriptionEdit } from 'src/pages/user/UserProfile/UserProfileDescriptionEdit';
import { Typography } from 'src/ui-components';
import { limitLinesVertical } from 'src/utils/style-utils';

export type UserProfileDescriptionProps = {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  onReload: () => void;
};

export const UserProfileDescription = ({
  userProfile,
  isCurrentUser,
  onReload,
}: UserProfileDescriptionProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <UserProfileCard
        title='Opis'
        onEdit={() => setIsEditMode(true)}
        showEditButton={isCurrentUser}
      >
        {userProfile.description ? (
          <Typography sx={limitLinesVertical(20)}>{userProfile.description}</Typography>
        ) : (
          <Typography fontStyle={'italic'} sx={{ opacity: 0.5 }}>
            {isCurrentUser ? 'Nie dodałeś żadnego opisu' : 'Użytkownik nie dodał żadnego opisu'}
          </Typography>
        )}
      </UserProfileCard>
      <UserProfileDescriptionEdit
        open={isEditMode}
        userProfile={userProfile}
        onClose={() => setIsEditMode(false)}
        onReload={onReload}
      />
    </>
  );
};
