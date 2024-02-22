import { useState } from 'react';
import { UserProfile } from 'src/models/user-profile';
import { useEditDescription } from 'src/queries/user-profile-queries';
import { Box, Button, Card, Icon, Stack, TextArea, Typography } from 'src/ui-components';
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
  const [value, setValue] = useState(userProfile.description);
  const { editDescription } = useEditDescription();

  const onSave = () => {
    editDescription(value, {
      onSuccess: () => {
        setIsEditMode(false);
        onReload();
      },
    });
  };

  return (
    <Box mt={2}>
      {isEditMode ? (
        <>
          <TextArea
            size='small'
            onChange={setValue}
            value={value ?? ''}
            fullWidth
            autoFocus
            minRows={5}
            showAmountOfCharacters
          ></TextArea>
          <Stack justifyContent={'flex-end'} gap={1} mt={1}>
            <Button size='small' variant='outlined' onClick={() => setIsEditMode(false)}>
              Anuluj
            </Button>
            <Button size='small' onClick={onSave}>
              Zapisz
            </Button>
          </Stack>
        </>
      ) : (
        <Card sx={{ pt: 2, pl: 2, pb: 1, pr: 1 }}>
          {userProfile.description ? (
            <Typography sx={limitLinesVertical(20)}>{userProfile.description}</Typography>
          ) : (
            <Typography fontStyle={'italic'} sx={{ opacity: 0.5 }}>
              {isCurrentUser ? 'Nie dodałeś żadnego opisu' : 'Użytkownik nie dodał żadnego opisu'}
            </Typography>
          )}
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
      )}
    </Box>
  );
};
