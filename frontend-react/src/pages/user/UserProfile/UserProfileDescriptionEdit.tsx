import { useEffect, useState } from 'react';
import { FullscreenDialog } from 'src/components/FullscreenDialog';
import { UserProfile } from 'src/models/user-profile';
import { useEditDescription } from 'src/queries/user-profile-queries';
import { Box, TextArea } from 'src/ui-components';

export type UserProfileDescriptionEditProps = {
  open: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onReload: () => void;
};

export const UserProfileDescriptionEdit = ({
  open,
  userProfile,
  onClose,
  onReload,
}: UserProfileDescriptionEditProps) => {
  const { editDescription, editDescriptionInProgress } = useEditDescription();
  const [value, setValue] = useState<UserProfile['description']>('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(userProfile.description);
      setIsDirty(false);
    }
  }, [open]);

  const handleSave = () => {
    editDescription(value, {
      onSuccess: () => {
        onClose();
        onReload();
      },
    });
  };

  const handleChange = (text: string) => {
    setIsDirty(true);
    setValue(text);
  };

  return (
    <FullscreenDialog
      open={open}
      onClose={onClose}
      saveDisabled={!isDirty || editDescriptionInProgress}
      onSave={handleSave}
    >
      <Box p={2}>
        <TextArea
          sx={{ mt: 2 }}
          size='small'
          onChange={handleChange}
          value={value ?? ''}
          fullWidth
          autoFocus
          placeholder='Napisz coś o sobie...'
          minRows={5}
          showAmountOfCharacters
        ></TextArea>
      </Box>
    </FullscreenDialog>
  );
};
