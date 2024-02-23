import { useState } from 'react';
import { LoginRequiredDialog } from 'src/components/LoginRequiredDialog';
import { UserProfile } from 'src/models/user-profile';
import { Box, Button, Icon } from 'src/ui-components';
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
      <Box textAlign={'center'}>
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
      </Box>
      {showLoginPrompt && (
        <LoginRequiredDialog
          loginRedirectUrl={privateChatUrl}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};
