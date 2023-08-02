import { Header } from 'src/components/Header/Header';
import { HomeCategoriesSearch } from 'src/pages/Home/HomeCategoriesSearch/HomeCategoriesSearch';
import { Container, Typography } from 'src/ui-components';

export async function loader() {
  return null;
}

export const Home = () => {
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
        <HomeCategoriesSearch></HomeCategoriesSearch>
      </Container>
    </>
  );
};

Home.displayName = 'HomePage';
