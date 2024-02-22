import { useEffect, useState } from 'react';
import { FullscreenDialog } from 'src/components/FullscreenDialog';
import { UserProfile } from 'src/models/user-profile';
import { useEditInterests, useGetAvailableInterests } from 'src/queries/user-profile-queries';
import { Box, Chip, Stack, Typography } from 'src/ui-components';

export type UserProfileInterestsEditProps = {
  open: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onReload: () => void;
};

export const UserProfileInterestsEdit = ({
  open,
  userProfile,
  onClose,
  onReload,
}: UserProfileInterestsEditProps) => {
  const { availableInterests } = useGetAvailableInterests();
  const { editInterests } = useEditInterests();
  const [selectedInterests, setSelectedInterests] = useState<UserProfile['interests']>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedInterests(userProfile.interests);
      setIsDirty(false);
    }
  }, [open]);

  const handleSave = () => {
    editInterests(selectedInterests, {
      onSuccess: () => {
        onClose();
        onReload();
      },
    });
  };

  const toggleSelected = (item: string) => {
    setIsDirty(true);
    if (selectedInterests.includes(item)) {
      setSelectedInterests((prev) => prev.filter((x) => x !== item));
    } else {
      setSelectedInterests((prev) => [...prev, item]);
    }
  };

  return (
    <FullscreenDialog open={open} onClose={onClose} saveDisabled={!isDirty} onSave={handleSave}>
      <Box p={2}>
        <Typography variant='h6'>Wybierz zainteresowania</Typography>
        {availableInterests && (
          <Stack mt={2} gap={1} flexWrap={'wrap'}>
            {availableInterests.map((x) => (
              <Chip
                key={x}
                label={x}
                color='primary'
                variant={selectedInterests.includes(x) ? 'filled' : 'outlined'}
                onClick={() => toggleSelected(x)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </FullscreenDialog>
  );
};
