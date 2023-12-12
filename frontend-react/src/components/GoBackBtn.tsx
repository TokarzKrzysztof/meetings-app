import { useNavigate } from 'react-router-dom';
import { Button, Icon } from 'src/ui-components';

export type GoBackBtnProps = {
  returnUrl?: string;
};

export const GoBackBtn = ({ returnUrl }: GoBackBtnProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant='text'
      startIcon={<Icon name='arrow_back' />}
      size='small'
      color='inherit'
      onClick={() => (returnUrl ? navigate(returnUrl) : navigate(-1))}
    >
      Wróć
    </Button>
  );
};
