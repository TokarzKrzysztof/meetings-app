import _ from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn/GoBackBtn';
import { Header } from 'src/components/Header/Header';
import { AnnouncementResultListItem } from 'src/pages/AnnouncementResultList/AnnouncementResultListItem/AnnouncementResultListItem';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { useGetProfileImages } from 'src/queries/user-queries';
import { Box, Button, Container, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const nameOf = <T,>(name: keyof T) => name;
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
  const numberParam = (name: keyof SearchParams) => {
    const value = searchParams.get(name);
    return value ? +value : null;
  };
  return [
    {
      categoryId: stringParam('categoryId')!,
      maxAge: stringParam('maxAge'),
    },
    setParams,
  ] as const;
};

export const AnnouncementResultList = () => {
  const [params, setParams] = useAnnouncementResultListSearchParams();
  const { allCategories } = useGetAllCategories();
  const { announcementResultList, announcementResultListFetching } = useGetAnnouncementResultList(params);
  const { profileImages } = useGetProfileImages(
    _.uniq(announcementResultList?.map((x) => x.userId)),
    {
      enabled: !announcementResultListFetching,
    }
  );

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <Header />
      <Container>
        <GoBackBtn to={AppRoutes.Home}>Wyszukaj ogłoszenia z innej kategorii</GoBackBtn>
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
          {announcementResultList?.length ? (
            announcementResultList.map((announcement) => (
              <AnnouncementResultListItem
                key={announcement.announcementId}
                data={announcement}
                imgSrc={
                  profileImages?.find((x) => x.id === announcement.userId)?.profileImage ?? null
                }
              />
            ))
          ) : (
            <Box mt={6} textAlign={'center'} color={'grey'}>
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
