import { useForm } from 'react-hook-form';
import { ControlledFormField } from 'src/components/ControlledFormField/ControlledFormField';
import { Header } from 'src/components/Header/Header';
import { Category } from 'src/models/category';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Container, Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';
import { Validators } from 'src/utils/helpers/validators';

type FormData = {
  category: Category;
  description: string;
};

export async function loader() {
  return null;
}

export const NewAnnouncement = () => {
  const form = useForm<FormData>();
  const { control, handleSubmit } = form;
  const { categories } = useGetAllCategories();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <>
      <Header />
      <Container
        maxWidth='sm'
        component='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography
          variant={'h5'}
          sx={{ my: 8 }}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          Nowe ogłoszenie
        </Typography>

        <ControlledFormField
          control={control}
          element={'autocomplete'}
          name={'category'}
          label={'Kategoria'}
          rules={{
            required: ValidationMessages.required,
          }}
          ElementProps={{
            optionsAsync: categories,
            getOptionLabel: (opt) => opt.name,
          }}
        />
        <ControlledFormField
          control={control}
          element='textarea'
          name={'description'}
          label={'Opis'}
          rules={{
            required: ValidationMessages.required,
            maxLength: Validators.maxStringLength,
          }}
        />
        <Box display={'flex'} justifyContent={'flex-end'} mt={2}>
          <Button type='submit'>Dodaj ogłoszenie</Button>
        </Box>
      </Container>
    </>
  );
};

NewAnnouncement.displayName = 'NewAnnouncement';
