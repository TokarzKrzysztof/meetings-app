import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from 'src/components/FormField';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { SettingsChangeEmailConfirmationDialog } from 'src/pages/account/Settings/sub-pages/SettingsChangeEmailConfirmationDialog';
import { SettingsActionButtons } from 'src/pages/account/Settings/sub-pages/shared/SettingsActionButtons';
import { SettingsForm } from 'src/pages/account/Settings/sub-pages/shared/SettingsForm';
import { SettingsHeader } from 'src/pages/account/Settings/sub-pages/shared/SettingsHeader';
import { SettingsTitle } from 'src/pages/account/Settings/sub-pages/shared/SettingsTitle';
import { useSendChangeEmailAddressEmail } from 'src/queries/user-queries';
import { Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

type FormData = {
  password: string;
  email: string;
};

export const SettingsChangeEmail = () => {
  const currentUser = useLoggedInUser();
  const form = useForm<FormData>();
  const { register, handleSubmit, setError, getValues } = form;
  const [showDialog, setShowDialog] = useState(false);
  const {
    sendChangeEmailAddressEmail,
    sendChangeEmailAddressEmailInProgress,
    sendChangeEmailAddressEmailError,
  } = useSendChangeEmailAddressEmail();

  useEffect(() => {
    if (sendChangeEmailAddressEmailError?.validationErrors.includes('PasswordIncorrect')) {
      setError('password', {
        message: 'Hasło jest nieprawidłowe',
      });
    }
  }, [sendChangeEmailAddressEmailError]);

  const onSubmit = (data: FormData) => {
    sendChangeEmailAddressEmail(data, {
      onSuccess: () => {
        setShowDialog(true);
      },
    });
  };

  return (
    <>
      <SettingsHeader />
      <SettingsForm onSubmit={handleSubmit(onSubmit)}>
        <SettingsTitle title='Zmiana adresu email'></SettingsTitle>
        <Typography mb={2}>
          Twój obecny adres email: <b>{currentUser.email}</b>
        </Typography>
        <FormField
          form={form}
          label='Hasło'
          {...register('password', {
            required: ValidationMessages.required,
          })}
          type='password'
        ></FormField>
        <FormField
          form={form}
          label='Nowy adres email'
          {...register('email', {
            required: ValidationMessages.required,
            pattern: {
              value: ValidationPatterns.email,
              message: ValidationMessages.email,
            },
          })}
        ></FormField>
        <SettingsActionButtons
          isSaveDisabled={sendChangeEmailAddressEmailInProgress}
        ></SettingsActionButtons>
      </SettingsForm>
      {showDialog && (
        <SettingsChangeEmailConfirmationDialog
          onRetry={() => onSubmit(getValues())}
          onClose={() => setShowDialog(false)}
          inProgress={sendChangeEmailAddressEmailInProgress}
        />
      )}
    </>
  );
};

SettingsChangeEmail.displayName = 'SettingsChangeEmail';
