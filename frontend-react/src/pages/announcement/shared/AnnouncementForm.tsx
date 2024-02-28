import { useForm } from 'react-hook-form';
import { PageTitle } from 'src/components/PageTitle';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { Announcement } from 'src/models/annoucement/announcement';
import { useGetCurrentUserOccupiedCategoryIds } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Button, Container, Stack } from 'src/ui-components';
import { experienceLevelOptions } from 'src/utils/announcement-utils';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { Validators } from 'src/utils/helpers/validators';

export type AnnouncementFormProps = {
  onSubmit: (data: Announcement) => void;
  title: string;
  inProgress: boolean;
  buttonText: string;
  data?: Announcement;
  disabledWhenUntouched?: boolean;
  isCategoryEditable?: boolean;
};

export const AnnouncementForm = ({
  onSubmit,
  title,
  inProgress,
  buttonText,
  data,
  disabledWhenUntouched,
  isCategoryEditable,
}: AnnouncementFormProps) => {
  const form = useForm<Announcement>({
    defaultValues: data,
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = form;
  const { allCategories } = useGetAllCategories();
  const { currentUserOccupiedCategoryIds } = useGetCurrentUserOccupiedCategoryIds();
  const categoryId = watch('categoryId');

  const selectedCategory = allCategories?.find((x) => x.id === categoryId);
  return (
    <Container maxWidth='sm' component='form' onSubmit={handleSubmit(onSubmit)}>
      <PageTitle>{title}</PageTitle>

      <ControlledFormField
        control={control}
        element='autocomplete'
        name='categoryId'
        label='Kategoria'
        rules={{
          required: ValidationMessages.required,
        }}
        ElementProps={{
          optionsAsync: currentUserOccupiedCategoryIds && allCategories ? allCategories : undefined,
          getOptionLabel: (opt) => opt.name,
          getOptionDisabled: (opt) => currentUserOccupiedCategoryIds!.includes(opt.id),
          helperText: 'Możesz mieć maksymalnie jedno aktywne ogłoszenie na daną kategorię',
          disabledOnBottom: true,
          disabled: !isCategoryEditable,
        }}
      />

      {selectedCategory?.hasExperienceLevel && (
        <ControlledFormField
          control={control}
          element='radio-group'
          name='experienceLevel'
          label='Poziom zaawansowania'
          rules={{ required: ValidationMessages.required }}
          ElementProps={{
            options: experienceLevelOptions,
            hasTopSpacing: true,
            isVertical: true,
          }}
        />
      )}
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

      <Stack mt={4} justifyContent='flex-end'>
        <Button type='submit' disabled={(disabledWhenUntouched && !isDirty) || inProgress}>
          {buttonText}
        </Button>
      </Stack>
    </Container>
  );
};
