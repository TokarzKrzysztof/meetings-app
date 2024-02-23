import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { SettingsActionButtons } from 'src/pages/account/Settings/sub-pages/shared/SettingsActionButtons';
import { SettingsForm } from 'src/pages/account/Settings/sub-pages/shared/SettingsForm';
import { SettingsHeader } from 'src/pages/account/Settings/sub-pages/shared/SettingsHeader';
import { SettingsTitle } from 'src/pages/account/Settings/sub-pages/shared/SettingsTitle';
import {
  PasswordFields,
  PasswordFieldsFormData,
} from 'src/pages/account/shared/PasswordFields';
import { useChangePassword } from 'src/queries/user-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

type FormData = {
  existingPassword: string;
} & PasswordFieldsFormData;

export const SettingsChangePassword = () => {
  const form = useForm<FormData>();
  const { register, handleSubmit, setError } = form;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { changePassword, changePasswordInProgress, changePasswordError } = useChangePassword();

  useEffect(() => {
    if (changePasswordError?.validationErrors.includes('PasswordIncorrect')) {
      setError('existingPassword', {
        message: 'Aktualne hasło jest nieprawidłowe',
      });
    }
  }, [changePasswordError]);

  const onSubmit = (data: FormData) => {
    changePassword(
      {
        existingPassword: data.existingPassword,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          enqueueSnackbar({
            variant: 'success',
            message: 'Hasło zostało zmienione',
          });
          navigate(AppRoutes.Settings());
        },
      },
    );
  };

  return (
    <>
      <SettingsHeader />
      <SettingsForm onSubmit={handleSubmit(onSubmit)}>
        <SettingsTitle title='Zmiana hasła'></SettingsTitle>
        <FormField
          form={form}
          label='Aktualne hasło'
          {...register('existingPassword', {
            required: ValidationMessages.required,
          })}
          type='password'
        ></FormField>
        <PasswordFields
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form={form as any}
          labels={['Nowe hasło', 'Powtórz nowe hasło']}
        ></PasswordFields>
        <SettingsActionButtons isSaveDisabled={changePasswordInProgress}></SettingsActionButtons>
      </SettingsForm>
    </>
  );
};

SettingsChangePassword.displayName = 'SettingsChangePassword';
