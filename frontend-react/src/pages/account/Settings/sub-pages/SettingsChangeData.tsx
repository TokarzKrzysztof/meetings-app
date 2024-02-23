import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormField } from 'src/components/FormField';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { User } from 'src/models/user';
import { SettingsActionButtons } from 'src/pages/account/Settings/sub-pages/shared/SettingsActionButtons';
import { SettingsForm } from 'src/pages/account/Settings/sub-pages/shared/SettingsForm';
import { SettingsHeader } from 'src/pages/account/Settings/sub-pages/shared/SettingsHeader';
import { SettingsTitle } from 'src/pages/account/Settings/sub-pages/shared/SettingsTitle';
import { useGetLocations } from 'src/queries/location-queries';
import { useChangePersonalData } from 'src/queries/user-queries';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { Validators } from 'src/utils/helpers/validators';
import { genderOptions } from 'src/utils/user-utils';

type FormData = Pick<User, 'firstName' | 'lastName' | 'birthDate' | 'gender' | 'locationId'>;

export const SettingsChangeData = () => {
  const { locations } = useGetLocations();
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
        navigate(-1);
      },
    });
  };

  return (
    <>
      <SettingsHeader />
      <SettingsForm onSubmit={handleSubmit(onSubmit)}>
        <SettingsTitle title='Edycja danych osobowych'></SettingsTitle>
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
          element='autocomplete'
          name='locationId'
          label='Miejsce zamieszkania'
          rules={{
            required: ValidationMessages.required,
          }}
          ElementProps={{
            optionsAsync: locations,
            getOptionLabel: (opt) => `${opt.city}, ${opt.adminName}`,
          }}
        ></ControlledFormField>
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

        <SettingsActionButtons
          isSaveDisabled={changePersonalDataInProgress || !isDirty}
        ></SettingsActionButtons>
      </SettingsForm>
    </>
  );
};

SettingsChangeData.displayName = 'SettingsChangeData';
