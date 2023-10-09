import { styled } from '@mui/material';
import { useAuthResendActivationLink } from 'src/queries/auth-queries';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Icon,
    Typography,
} from 'src/ui-components';

const StyledCheckIconWrapper = styled(Box)(({ theme }) => {
  const size = 50;
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    margin: '0 auto',
    width: size,
    height: size,
    border: `2px solid ${theme.palette.success.main}`,
  };
});

export type RegisterSuccessProps = {
  email: string;
};

export const RegisterSuccess = ({ email }: RegisterSuccessProps) => {
  const { resendActivationLink, resendActivationLinkInProgress } =
    useAuthResendActivationLink();

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card>
        <CardContent sx={{ minWidth: 250 }}>
          <StyledCheckIconWrapper>
            <Icon name='check' color='success' />
          </StyledCheckIconWrapper>
          <Typography
            variant={'h5'}
            mt={5}
            textAlign={'center'}
            fontWeight={'bold'}
          >
            Gratulacje!
          </Typography>
          <Typography textAlign={'center'} mt={2}>
            Twoje konto zostało utworzone. <br /> Sprawdź adres e-mail i
            postępuj zgodnie z instrukcjami aby aktywować swoje konto.
          </Typography>
          <Box textAlign={'center'} mt={8}>
            <Typography>Link nie dotarł?</Typography>
            <Button
              variant='text'
              disabled={resendActivationLinkInProgress}
              onClick={() => resendActivationLink(email)}
            >
              Wyślij ponownie
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
