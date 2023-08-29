import { Header } from 'src/components/Header/Header';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch/HomeCategoriesSearch';
import { useCategoryGetAllCategories } from 'src/queries/category-queries';
import { Container, Typography } from 'src/ui-components';

export async function loader() {
  return null;
}

export const Home = () => {
  const { categories } = useCategoryGetAllCategories();
  
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
