import { useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { AnnouncementResultListItem } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListItem';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Container, Stack, Typography } from 'src/ui-components';

// const nameOf = <T,>(name: keyof T) => name;
type SearchParams = {
  categoryId: string;
  maxAge: string;
};

const useAnnouncementResultListSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams({ maxAge: '23' });
  const setParams = (params: SearchParams) => {
    setSearchParams(params);
  };

  const stringParam = (name: keyof SearchParams) => {
    return searchParams.get(name);
  };
  // const numberParam = (name: keyof SearchParams) => {
  //   const value = searchParams.get(name);
  //   return value ? +value : null;
  // };
  return [
    {
      categoryId: stringParam('categoryId')!,
      maxAge: stringParam('maxAge'),
    },
    setParams,
  ] as const;
};

export const AnnouncementResultList = () => {
  const [params] = useAnnouncementResultListSearchParams();
  const { allCategories } = useGetAllCategories();
  const { announcementResultList } =
    useGetAnnouncementResultList(params);

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <Header />
      <Container>
        {/* <GoBackBtn to={AppRoutes.Home()}>Wyszukaj ogłoszenia z innej kategorii</GoBackBtn> */}
        <Stack justifyContent='space-between' alignItems='center'>
          <Typography my={2}>
            Ogłoszenia z kategorii:{' '}
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
          </Typography>
          <Button size='small' variant='outlined'>
            Filtruj
          </Button>
        </Stack>
        <Stack direction='column' gap={2}>
          {announcementResultList?.length ? (
            announcementResultList.map((announcement) => (
              <AnnouncementResultListItem key={announcement.announcementId} data={announcement} />
            ))
          ) : (
            <Box mt={6} textAlign='center' color='grey'>
              <Typography>
                Brak ogłoszeń z kategorii <br />
                <b>{categoryName}</b>
              </Typography>
              <Typography mt={1} fontSize={12}>
                Spróbuj zmnienić kryteria wyszukiwania
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
