import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from 'src/components/FormField';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { MyProfileChangeEmailConfirmationDialog } from 'src/pages/account/MyProfile/sub-pages/MyProfileChangeEmailConfirmationDialog';
import { MyProfileActionButtons } from 'src/pages/account/MyProfile/sub-pages/shared/MyProfileActionButtons';
import { MyProfileForm } from 'src/pages/account/MyProfile/sub-pages/shared/MyProfileForm';
import { MyProfileHeader } from 'src/pages/account/MyProfile/sub-pages/shared/MyProfileHeader';
import { MyProfileTitle } from 'src/pages/account/MyProfile/sub-pages/shared/MyProfileTitle';
import { useSendChangeEmailAddressEmail } from 'src/queries/user-queries';
import { Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { ValidationPatterns } from 'src/utils/helpers/validation-patterns';

type FormData = {
  password: string;
  email: string;
};

export const MyProfileChangeEmail = () => {
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
      <MyProfileHeader />
      <MyProfileForm onSubmit={handleSubmit(onSubmit)}>
        <MyProfileTitle title='Zmiana adresu email'></MyProfileTitle>
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
        <MyProfileActionButtons
          isSaveDisabled={sendChangeEmailAddressEmailInProgress}
        ></MyProfileActionButtons>
      </MyProfileForm>
      <MyProfileChangeEmailConfirmationDialog
        show={showDialog}
        onRetry={() => onSubmit(getValues())}
        onClose={() => setShowDialog(false)}
        inProgress={sendChangeEmailAddressEmailInProgress}
      />
    </>
  );
};

MyProfileChangeEmail.displayName = 'MyProfileChangeEmail';
