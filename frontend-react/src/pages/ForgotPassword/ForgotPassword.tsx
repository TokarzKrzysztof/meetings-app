import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import { AuthForm } from 'src/components/AuthForm/AuthForm';
import { AuthGoBackBtn } from 'src/components/AuthGoBackBtn/AuthGoBackBtn';
import { AuthIcon } from 'src/components/AuthIcon/AuthIcon';
import { AuthRedirectInfo } from 'src/components/AuthRedirectInfo/AuthRedirectInfo';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';
import { ForgotPasswordConfirmationDialog } from 'src/pages/ForgotPassword/ForgotPasswordConfirmationDialog/ForgotPasswordConfirmationDialog';
import { useSendForgotPasswordEmail } from 'src/queries/auth-queries';
import { Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

export const ForgotPassword = () => {
  const form = useForm<{ email: string }>();
  const { register, handleSubmit, control, getValues } = form;
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
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthIcon iconName='email'></AuthIcon>
        <Typography align='center' mb={2}>
          Wpisz adres email powiązany z kontem i postępuj zgodnie z instrukcjami
          aby zresetować swoje hasło
        </Typography>
        <FormField
          form={form}
          label={'Email'}
          {...register('email', {
            required: ValidationMessages.required,
            pattern: {
              value: ValidationPatterns.email,
              message: ValidationMessages.email,
            },
          })}
        ></FormField>
        <AuthButton disabled={sendForgotPasswordEmailInProgress}>
          Wyślij
        </AuthButton>
        <AuthRedirectInfo>
          <Button variant='text' component={Link} to={AppRoutes.Login}>
            Wróć do logowania
          </Button>
        </AuthRedirectInfo>
      </AuthForm>
      <ForgotPasswordConfirmationDialog
        show={showDialog}
        onRetry={() => sendForgotPasswordEmail(getValues('email'))}
        onClose={() => setShowDialog(false)}
        inProgress={sendForgotPasswordEmailInProgress}
      />
    </>
  );
};

ForgotPassword.displayName = 'ForgotPassword';
