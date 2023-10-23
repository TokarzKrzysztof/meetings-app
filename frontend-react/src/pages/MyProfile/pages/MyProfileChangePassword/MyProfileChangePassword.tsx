import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormField } from 'src/components/FormField/FormField';
import { Header } from 'src/components/Header/Header';
import {
  PasswordFields,
  PasswordFieldsFormData,
} from 'src/components/PasswordFields/PasswordFields';
import { MyProfileActionButtons } from 'src/components/my-profile/MyProfileActionButtons/MyProfileActionButtons';
import { MyProfileForm } from 'src/components/my-profile/MyProfileForm/MyProfileForm';
import { MyProfileTitle } from 'src/components/my-profile/MyProfileTitle/MyProfileTitle';
import { useChangePassword } from 'src/queries/user-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

type FormData = {
  existingPassword: string;
} & PasswordFieldsFormData;

export const MyProfileChangePassword = () => {
  const form = useForm<FormData>();
  const { register, handleSubmit, setError } = form;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { changePassword, changePasswordInProgress, changePasswordError } =
    useChangePassword();

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
          navigate(AppRoutes.MyProfile);
        },
      }
    );
  };

  return (
    <>
      <Header />
      <MyProfileForm onSubmit={handleSubmit(onSubmit)}>
        <MyProfileTitle title='Zmiana hasła'></MyProfileTitle>
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
        <MyProfileActionButtons
          isSaveDisabled={changePasswordInProgress}
        ></MyProfileActionButtons>
      </MyProfileForm>
    </>
  );
};

MyProfileChangePassword.displayName = 'MyProfileChangePassword';
