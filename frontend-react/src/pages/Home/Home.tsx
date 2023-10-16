import { Header } from 'src/components/Header/Header';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch/HomeCategoriesSearch';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Typography } from 'src/ui-components';

export const Home = () => {
  const { categories } = useGetAllCategories();

  return (
    <>
      <Header />
      <Container>
        <Typography
          variant={'h4'}
          sx={{ my: 8 }}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          Znajdź ludzi dzielących Twoje zainteresowania!
        </Typography>
        <HomeCategoriesSearch data={categories}></HomeCategoriesSearch>
      </Container>
    </>
  );
};

Home.displayName = 'HomePage';
