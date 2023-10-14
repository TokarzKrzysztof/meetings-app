import { useForm } from 'react-hook-form';
import { ControlledFormField } from 'src/components/ControlledFormField/ControlledFormField';
import { Header } from 'src/components/Header/Header';
import { Category } from 'src/models/category';
import { useCategoryGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Container, Typography } from 'src/ui-components';
import { ValidationMessages } from 'src/utils/helpers/validation-messages';

export type Announcement = {
  id: string;
  categoryId: string;
  userId: string;
  description: string;
};

type FormData = {
  category: Category;
  description: string;
};

export async function loader() {
  return null;
}

export const NewAnnouncement = () => {
  const form = useForm<FormData>();
  const { register, control, handleSubmit } = form;
  const { categories } = useCategoryGetAllCategories();

  const onSubmit = (data: FormData) => {
    console.log(data)
    // login(data, {
    //   onSuccess: (user) => {
    //     setCurrentUser(user);
    //     navigate(AppRoutes.Home);
    //   },
    //   onError: (err) => {
    //     if (err.response?.data.statusCode === 403) {
    //       resendActivationLink(getValues('email'));
    //     }
    //   },
    // });
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
        ></ControlledFormField>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button type='submit'>Dodaj</Button>
        </Box>
        {/* <FormField
          form={form}
          select
          label={'Kategoria'}
          // InputProps={{
          //   endAdornment: visibilityButton,
          // }}
          {...register('categoryId', {
            required: ValidationMessages.required,
          })}
          // validate: (value: string) => {
          //   if (getValues('password') !== value) {
          //     return ValidationMessages.passwordsNotMatch;
          //   }
          // },
          // })}
        ></FormField> */}
        {/* <HomeCategoriesSearch data={categories}></HomeCategoriesSearch> */}
      </Container>
    </>
  );
};

NewAnnouncement.displayName = 'NewAnnouncement';
