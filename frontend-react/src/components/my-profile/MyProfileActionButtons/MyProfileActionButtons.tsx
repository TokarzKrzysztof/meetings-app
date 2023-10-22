import { Link } from 'react-router-dom';
import { Button, Stack } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyProfileActionButtonsProps = {
  isSaveDisabled: boolean;
};

export const MyProfileActionButtons = ({
  isSaveDisabled,
}: MyProfileActionButtonsProps) => {
  return (
    <Stack mt={4} justifyContent={'space-between'}>
      <Button
        type='button'
        variant='outlined'
        component={Link}
        to={AppRoutes.MyProfile}
      >
        Anuluj
      </Button>

      <Button type='submit' disabled={isSaveDisabled}>
        Zapisz zmiany
      </Button>
    </Stack>
  );
};
