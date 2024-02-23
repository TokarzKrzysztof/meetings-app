import { useEffect, useState } from 'react';
import { FullscreenDialog } from 'src/components/FullscreenDialog';
import { Interest, UserProfile } from 'src/models/user-profile';
import { useEditInterests, useGetAvailableInterests } from 'src/queries/user-profile-queries';
import { Box, Chip, Icon, IconNames, Stack, Typography } from 'src/ui-components';

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
  const { availableInterests } = useGetAvailableInterests({
    enabled: open
  });
  const { editInterests } = useEditInterests();
  const [selectedInterestsIds, setSelectedInterestsIds] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedInterestsIds(userProfile.interests.map((x) => x.id));
      setIsDirty(false);
    }
  }, [open]);

  const handleSave = () => {
    editInterests(selectedInterestsIds, {
      onSuccess: () => {
        onClose();
        onReload();
      },
    });
  };

  const toggleSelected = (item: Interest) => {
    setIsDirty(true);
    if (selectedInterestsIds.includes(item.id)) {
      setSelectedInterestsIds((prev) => prev.filter((x) => x !== item.id));
    } else {
      setSelectedInterestsIds((prev) => [...prev, item.id]);
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
                key={x.id}
                label={x.name}
                icon={<Icon fontSize={'small'} name={x.iconName as IconNames} />}
                color='primary'
                variant={selectedInterestsIds.includes(x.id) ? 'filled' : 'outlined'}
                onClick={() => toggleSelected(x)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </FullscreenDialog>
  );
};
