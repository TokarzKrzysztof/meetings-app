import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { Announcement } from 'src/models/annoucement/announcement';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Button, Container, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { Validators } from 'src/utils/helpers/validators';

export type AnnouncementFormProps = {
  data?: Announcement;
  disabledWhenUntouched?: boolean;
  onSubmit: (data: Announcement) => void;
  title: string;
  inProgress: boolean;
  buttonText: string;
};

export const AnnouncementForm = ({
  data,
  onSubmit,
  disabledWhenUntouched,
  title,
  inProgress,
  buttonText,
}: AnnouncementFormProps) => {
  const form = useForm<Announcement>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;
  const { allCategories } = useGetAllCategories();

  useEffect(() => {
    if (allCategories && data) {
      reset(data);
    }
  }, [allCategories, data]);

  return (
    <Container maxWidth='sm' component='form' onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h5' sx={{ my: 8 }} textAlign='center' fontWeight='bold'>
        {title}
      </Typography>

      <ControlledFormField
        control={control}
        element='autocomplete'
        name='categoryId'
        label='Kategoria'
        rules={{
          required: ValidationMessages.required,
        }}
        ElementProps={{
          optionsAsync: allCategories,
          getOptionLabel: (opt) => opt.name,
        }}
      />
      <ControlledFormField
        control={control}
        element='textarea'
        name='description'
        label='Opis'
        rules={{
          required: ValidationMessages.required,
          maxLength: Validators.maxStringLength,
        }}
      />
      <Stack mt={4} justifyContent={'space-between'}>
        <Button type='button' variant='outlined' component={Link} to={AppRoutes.MyAnnouncements()}>
          Anuluj
        </Button>
        <Button type='submit' disabled={(disabledWhenUntouched && !isDirty) || inProgress}>
          {buttonText}
        </Button>
      </Stack>
    </Container>
  );
};
