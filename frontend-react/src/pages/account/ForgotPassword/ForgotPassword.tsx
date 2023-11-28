import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { Header } from 'src/components/header/Header';
import { ForgotPasswordConfirmationDialog } from 'src/pages/account/ForgotPassword/ForgotPasswordConfirmationDialog';
import { AuthButton } from 'src/pages/account/shared/AuthButton';
import { AuthForm } from 'src/pages/account/shared/AuthForm';
import { AuthGoBackBtn } from 'src/pages/account/shared/AuthGoBackBtn';
import { AuthIcon } from 'src/pages/account/shared/AuthIcon';
import { AuthRedirectInfo } from 'src/pages/account/shared/AuthRedirectInfo';
import { useSendForgotPasswordEmail } from 'src/queries/auth-queries';
import { Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

export const ForgotPassword = () => {
  const form = useForm<{ email: string }>();
  const { register, handleSubmit, getValues } = form;
  const [showDialog, setShowDialog] = useState(false);
  const { sendForgotPasswordEmail, sendForgotPasswordEmailInProgress } =
    useSendForgotPasswordEmail();

  const onSubmit = (data: { email: string }) => {
    sendForgotPasswordEmail(data.email, {
      onSuccess: () => setShowDialog(true),
    });
  };

  return (
    <>
      <Header leftSlot={<AuthGoBackBtn />} />
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthIcon iconName='email'></AuthIcon>
        <Typography align='center' mb={2}>
          Wpisz adres email powiązany z kontem i postępuj zgodnie z instrukcjami aby zresetować
          swoje hasło
        </Typography>
        <FormField
          form={form}
          label='Email'
          {...register('email', {
            required: ValidationMessages.required,
            pattern: {
              value: ValidationPatterns.email,
              message: ValidationMessages.email,
            },
          })}
        ></FormField>
        <AuthButton disabled={sendForgotPasswordEmailInProgress}>Wyślij</AuthButton>
        <AuthRedirectInfo>
          <Button variant='text' component={Link} to={AppRoutes.Login()}>
            Wróć do logowania
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
      <ForgotPasswordConfirmationDialog
        show={showDialog}
        onRetry={() => onSubmit(getValues())}
        onClose={() => setShowDialog(false)}
        inProgress={sendForgotPasswordEmailInProgress}
      />
    </>
  );
};

ForgotPassword.displayName = 'ForgotPassword';
