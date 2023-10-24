import { Link, useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header/Header';
import { AnnouncementResultListItem } from 'src/pages/AnnouncementResultList/AnnouncementResultListItem/AnnouncementResultListItem';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Button, Container, Icon, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const nameOf = <T,>(name: keyof T) => name;
type SearchParams = {
  categoryId: string;
  maxAge: string;
};

const useAnnouncementResultListSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: SearchParams) => {
    setSearchParams(params);
  };

  const stringParam = (name: keyof SearchParams) => {
    return searchParams.get(name);
  };
  const numberParam = (name: keyof SearchParams) => {
    const value = searchParams.get(name);
    return value ? +value : null;
  };
  return [
    {
      categoryId: stringParam('categoryId')!,
      maxAge: numberParam('maxAge'),
    },
    setParams,
  ] as const;
};

export const AnnouncementResultList = () => {
  const [{ categoryId, maxAge }, setParams] = useAnnouncementResultListSearchParams();
  const { allCategories } = useGetAllCategories();
  // useEffect(() => {
  //   if(searchParams?.get())
  // }, [searchParams])
  console.log(maxAge);

  const categoryName = allCategories?.find((x) => x.id === categoryId)?.name;
  return (
    <>
      <Header />
      <Container>
        <Button
          variant='text'
          startIcon={<Icon name='arrow_back' />}
          size='small'
          component={Link}
          to={AppRoutes.Home}
          sx={{ mt: 1 }}
        >
          Wyszukaj ogłoszenia z innej kategorii
        </Button>
        <Stack justifyContent={'space-between'} alignItems={'center'}>
          <Typography my={2}>
            Ogłoszenia z kategorii:{' '}
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
          </Typography>
          <Button size='small' variant='outlined'>
            Filtruj
          </Button>
        </Stack>
        <Stack direction='column' gap={2}>
          <AnnouncementResultListItem />
          <AnnouncementResultListItem />
        </Stack>
      </Container>
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
