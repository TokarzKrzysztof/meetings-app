import { useState } from 'react';
import { LoginRequiredDialog } from 'src/components/LoginRequiredDialog';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileActionsMore } from 'src/pages/user/UserProfile/UserProfileActionsMore';
import { Button, Icon, Stack } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type UserProfileActionsProps = {
  userProfile: UserProfile;
  isLoggedIn: boolean;
};

export const UserProfileActions = ({ userProfile, isLoggedIn }: UserProfileActionsProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const privateChatUrl = AppRoutes.PrivateChat({
    userId: userProfile.user.id,
  });

  return (
    <>
      <Stack justifyContent={'center'} gap={1}>
        <Button
          variant='outlined'
          startIcon={<Icon name='message' />}
          buttonOrLink={{
            isLink: isLoggedIn,
            to: privateChatUrl,
            onClick: () => setShowLoginPrompt(true),
          }}
        >
          Wiadomość
        </Button>
        {isLoggedIn && (
          <UserProfileActionsMore userProfile={userProfile} />
        )}
      </Stack>
      {showLoginPrompt && (
        <LoginRequiredDialog
          loginRedirectUrl={privateChatUrl}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};
