import { Button, Stack } from 'src/ui-components';

export type SettingsActionButtonsProps = {
  isSaveDisabled: boolean;
};

export const SettingsActionButtons = ({ isSaveDisabled }: SettingsActionButtonsProps) => {
  return (
    <Stack mt={4} justifyContent='flex-end'>
      <Button type='submit' disabled={isSaveDisabled}>
        Zapisz zmiany
      </Button>
    </Stack>
  );
};
