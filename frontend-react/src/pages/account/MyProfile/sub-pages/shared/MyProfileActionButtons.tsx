import { Button, Stack } from 'src/ui-components';

export type MyProfileActionButtonsProps = {
  isSaveDisabled: boolean;
};

export const MyProfileActionButtons = ({ isSaveDisabled }: MyProfileActionButtonsProps) => {
  return (
    <Stack mt={4} justifyContent='flex-end'>
      <Button type='submit' disabled={isSaveDisabled}>
        Zapisz zmiany
      </Button>
    </Stack>
  );
};
