import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { Header } from 'src/components/header/Header';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { User } from 'src/models/user';
import { MyProfileActionButtons } from 'src/pages/account/MyProfile/shared/MyProfileActionButtons';
import { MyProfileForm } from 'src/pages/account/MyProfile/shared/MyProfileForm';
import { MyProfileTitle } from 'src/pages/account/MyProfile/shared/MyProfileTitle';
import { useChangePersonalData } from 'src/queries/user-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { Validators } from 'src/utils/helpers/validators';
import { genderOptions } from 'src/utils/user-utils';

type FormData = Pick<User, 'firstName' | 'lastName' | 'birthDate' | 'gender'>;

export const MyProfileChangeData = () => {
  const currentUser = useLoggedInUser();
  const form = useForm<FormData>({
    defaultValues: currentUser,
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = form;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setCurrentUser } = useSetQueryData();
  const { changePersonalData, changePersonalDataInProgress } = useChangePersonalData();

  const onSubmit = (data: FormData) => {
    changePersonalData(data, {
      onSuccess: (user) => {
        setCurrentUser(user);
        enqueueSnackbar({
          variant: 'success',
          message: 'Dane zostały zaktualizowane',
        });
        navigate(AppRoutes.MyProfile());
      },
    });
  };

  return (
    <>
      <Header />
      <MyProfileForm onSubmit={handleSubmit(onSubmit)}>
        <MyProfileTitle title='Edycja danych osobowych'></MyProfileTitle>
        <FormField
          form={form}
          label='Imię'
          {...register('firstName', {
            required: ValidationMessages.required,
          })}
        ></FormField>
        <FormField
          form={form}
          label='Nazwisko'
          {...register('lastName', { required: ValidationMessages.required })}
        ></FormField>
        <ControlledFormField
          control={control}
          element='date-picker'
          name='birthDate'
          label='Data urodzenia'
          rules={{
            required: ValidationMessages.required,
            validate: Validators.maxDate,
          }}
          ElementProps={{
            disableFuture: true,
          }}
        ></ControlledFormField>
        <ControlledFormField
          control={control}
          element='radio-group'
          name='gender'
          label='Płeć'
          rules={{ required: ValidationMessages.required }}
          ElementProps={{
            options: genderOptions,
          }}
        ></ControlledFormField>

        <MyProfileActionButtons
          isSaveDisabled={changePersonalDataInProgress || !isDirty}
        ></MyProfileActionButtons>
      </MyProfileForm>
    </>
  );
};

MyProfileChangeData.displayName = 'MyProfileChangeData';
