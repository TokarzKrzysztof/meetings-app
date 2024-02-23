import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Typography } from 'src/ui-components';
import { HomeParams } from 'src/utils/enums/app-routes';

export const Home = () => {
  const params = useRouteParams<HomeParams>();
  const { allCategories } = useGetAllCategories();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (params.isFromChangeEmailAddress) {
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
        <Typography variant='h4' sx={{ my: 6 }} textAlign='center' fontWeight='bold'>
          Znajdź ludzi dzielących Twoje zainteresowania!
        </Typography>
        <HomeCategoriesSearch data={allCategories}></HomeCategoriesSearch>
      </Container>
    </>
  );
};

Home.displayName = 'HomePage';
