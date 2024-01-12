import { UseFormReturn } from 'react-hook-form';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { Container, InputAdornment } from 'src/ui-components';
import {
  AnnouncementResultListQueryParams,
  GenderFilter,
  announcementFilterConstants,
} from 'src/utils/announcement-filters-utils';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

const filterGenderOptions = [
  {
    value: GenderFilter.All,
    label: 'Wszyscy',
  },
  {
    value: GenderFilter.Males,
    label: 'Mężczyźni',
  },
  {
    value: GenderFilter.Females,
    label: 'Kobiety',
  },
] as const;

export type AnnouncementResultListHeaderFiltersFormFieldsProps = {
  form: UseFormReturn<AnnouncementResultListQueryParams, any, undefined>;
};

export const AnnouncementResultListHeaderFiltersFormFields = ({
  form,
}: AnnouncementResultListHeaderFiltersFormFieldsProps) => {
  const { control } = form;

  return (
    <Container sx={{ mt: 3 }}>
      <ControlledFormField
        control={control}
        element='slider'
        name='ageRange'
        label='Wiek'
        rules={{ required: ValidationMessages.required }}
        ElementProps={{
          isRange: true,
          min: announcementFilterConstants.minAge,
          max: announcementFilterConstants.maxAge,
          renderPreview: (values) => {
            const [from, to] = values as number[];
            return `${from} - ${to} lat`;
          },
        }}
      ></ControlledFormField>
      <ControlledFormField
        control={control}
        element='slider'
        name='distanceMax'
        label='Odległość'
        rules={{ required: ValidationMessages.required }}
        ElementProps={{
          renderPreview: (value) => `do ${value ?? '---'} km`,
          inputEndAdornment: <InputAdornment position='end'>km</InputAdornment>,
        }}
      ></ControlledFormField>
      <ControlledFormField
        control={control}
        element='radio-group'
        name='gender'
        label='Płeć'
        rules={{ required: ValidationMessages.required }}
        ElementProps={{
          options: filterGenderOptions,
        }}
      ></ControlledFormField>
    </Container>
  );
};
