import { useState } from 'react';
import { Header } from 'src/components/header/Header';
import { AnnouncementResultListFilters } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListFilters';
import { AnnouncementResultListItem } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListItem';
import { useAnnouncementResultListFilterParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultListParams';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Container, Stack, Toolbar, Typography } from 'src/ui-components';

export const AnnouncementResultList = () => {
  const [showFiltersDialog, setShowFiltersDialog] = useState(true);
  const { allCategories } = useGetAllCategories();
  const [params, setParams] = useAnnouncementResultListFilterParams();
  const { announcementResultList } = useGetAnnouncementResultList(params);

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <Header
        secondToolbar={
          <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: 'white' }}>
            <Typography color={'black'}>
              Ogłoszenia z kategorii:{' '}
              <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
            </Typography>
            <Button size='small' onClick={() => setShowFiltersDialog(true)}>
              Filtruj
            </Button>
          </Toolbar>
        }
      />
      <Container>
        {/* <GoBackBtn to={AppRoutes.Home()}>Wyszukaj ogłoszenia z innej kategorii</GoBackBtn> */}
        <Stack direction='column' gap={2} py={2}>
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
      {/* this needs to be like this for hiding animation to work */}
      <AnnouncementResultListFilters
        params={params}
        setParams={setParams}
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
      />
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
