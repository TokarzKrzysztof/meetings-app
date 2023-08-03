import { useQuery } from 'react-query';
import { Header } from 'src/components/Header/Header';
import { CategoryService } from 'src/http-services/category-service';
import { Category } from 'src/models/category';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch/HomeCategoriesSearch';
import { Container, Typography } from 'src/ui-components';

export async function loader() {
  return null;
}

export const Home = () => {
  const { data } = useQuery<Category[]>('categories', () =>
    CategoryService.getAllCategories()
  );
  
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
        <HomeCategoriesSearch data={data}></HomeCategoriesSearch>
      </Container>
    </>
  );
};

Home.displayName = 'HomePage';
