import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ControlledFormField } from 'src/components/ControlledFormField/ControlledFormField';
import { Header } from 'src/components/Header/Header';
import { Category } from 'src/models/category';
import { useCreateNewAnnouncement } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Container, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
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
  const { createNewAnnouncement, createNewAnnouncementInProgress } =
    useCreateNewAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    createNewAnnouncement(
      {
        categoryId: data.category.id,
        description: data.description,
      },
      {
        onSuccess: () => {
          enqueueSnackbar({
            variant: 'success',
            message: 'Ogłoszenie zostało dodane',
          });
          // redirect to my announcements in the future
          navigate(AppRoutes.Home);
        },
      }
    );
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
          <Button type='submit' disabled={createNewAnnouncementInProgress}>
            Dodaj ogłoszenie
          </Button>
        </Box>
      </Container>
    </>
  );
};

NewAnnouncement.displayName = 'NewAnnouncement';
