import { useNavigateBack } from 'src/hooks/useNavigateBack';
import { Button, Icon } from 'src/ui-components';

export type GoBackBtnProps = {};

export const GoBackBtn = ({ ...props }: GoBackBtnProps) => {
  const navigateBack = useNavigateBack();

  return (
    <Button
      variant='text'
      startIcon={<Icon name='arrow_back' />}
      size='small'
      color='inherit'
      onClick={navigateBack}
    >
      Wróć
    </Button>
  );
};
