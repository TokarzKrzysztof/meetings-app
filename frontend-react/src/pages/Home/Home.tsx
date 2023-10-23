import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Header } from 'src/components/Header/Header';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch/HomeCategoriesSearch';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Typography } from 'src/ui-components';

export const Home = () => {
  const { allCategories } = useGetAllCategories();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('isFromChangeEmailAddress')) {
      enqueueSnackbar({
        variant: 'success',
        message: 'Twój adres email został zmieniony',
      });
    }
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Typography variant='h4' sx={{ my: 8 }} textAlign='center' fontWeight='bold'>
          Znajdź ludzi dzielących Twoje zainteresowania!
        </Typography>
        <HomeCategoriesSearch data={allCategories}></HomeCategoriesSearch>
      </Container>
    </>
  );
};

Home.displayName = 'HomePage';
