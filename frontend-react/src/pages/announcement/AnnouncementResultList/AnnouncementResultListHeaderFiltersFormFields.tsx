import { UseFormReturn } from 'react-hook-form';
import { ControlledFormField } from 'src/components/controlled-form-field/ControlledFormField';
import { useAnnouncementResultListQueryParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultQueryParams';
import { useGetCategory } from 'src/queries/category-queries';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Container, InputAdornment } from 'src/ui-components';
import {
  ResultListQueryParams,
  filterConstants,
  filterExperienceLevelOptions,
  filterGenderOptions
} from 'src/utils/announcement-result-list-utils';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type AnnouncementResultListHeaderFiltersFormFieldsProps = {
  form: UseFormReturn<ResultListQueryParams, any, undefined>;
};

export const AnnouncementResultListHeaderFiltersFormFields = ({
  form,
}: AnnouncementResultListHeaderFiltersFormFieldsProps) => {
  const [params] = useAnnouncementResultListQueryParams();
  const { category } = useGetCategory(params.categoryId);
  const { currentUser } = useGetCurrentUser();
  const { control } = form;

  if (!category) return null;
  return (
    <Container>
      <ControlledFormField
        control={control}
        element='slider'
        name='ageRange'
        label='Wiek'
        rules={{ required: ValidationMessages.required }}
        ElementProps={{
          isRange: true,
          min: filterConstants.minAge,
          max: filterConstants.maxAge,
          renderPreview: (values) => {
            const [from, to] = values as number[];
            return `${from} - ${to} lat`;
          },
        }}
      ></ControlledFormField>
      {currentUser && (
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
      )}
      <ControlledFormField
        control={control}
        element='radio-group'
        name='gender'
        label='Płeć'
        ElementProps={{
          options: filterGenderOptions,
          isVertical: true
        }}
      ></ControlledFormField>
      {category.hasExperienceLevel && (
        <ControlledFormField
          control={control}
          element='radio-group'
          name='experienceLevel'
          label='Poziom zaawansowania'
          ElementProps={{
            options: filterExperienceLevelOptions,
            isVertical: true
          }}
        ></ControlledFormField>
      )}
    </Container>
  );
};
