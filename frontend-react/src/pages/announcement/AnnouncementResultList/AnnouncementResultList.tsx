import { useState } from 'react';
import { Header } from 'src/components/header/Header';
import { AnnouncementResultListFilters } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListFilters';
import { AnnouncementResultListItem } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListItem';
import { useAnnouncementResultListFilterParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultListParams';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from 'src/ui-components';
import { SortOption } from 'src/utils/announcement-filters-utils';

export const AnnouncementResultList = () => {
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const { allCategories } = useGetAllCategories();
  const [params, setParams] = useAnnouncementResultListFilterParams();
  const { announcementResultList } = useGetAnnouncementResultList(params);

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <Header
        secondToolbar={
          <Toolbar
            sx={{ justifyContent: 'space-between', backgroundColor: 'white', minHeight: 65 }}
          >
            <TextField
              select
              label='Sortowanie'
              size='small'
              value={params.sortBy}
              SelectProps={{
                onChange: (e) => setParams({ ...params, sortBy: e.target.value as SortOption }),
              }}
            >
              <MenuItem value={SortOption.Newest}>Od najnowszych</MenuItem>
              <MenuItem value={SortOption.Oldest}>Od najstarszych</MenuItem>
              <MenuItem value={SortOption.DistanceMin}>Odległość: od najmniejszej</MenuItem>
              <MenuItem value={SortOption.DistanceMax}>Odległość: od największej</MenuItem>
            </TextField>
            <Button size='small' onClick={() => setShowFiltersDialog(true)}>
              Filtruj
            </Button>
          </Toolbar>
        }
      />
      <Container>
        {/* <GoBackBtn to={AppRoutes.Home()}>Wyszukaj ogłoszenia z innej kategorii</GoBackBtn> */}

        {announcementResultList?.length ? (
          <>
            <Typography color={'black'} my={2}>
              Ogłoszenia z kategorii:{' '}
              <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
            </Typography>
            <Stack direction='column' gap={2} py={2}>
              {announcementResultList.map((announcement) => (
                <AnnouncementResultListItem key={announcement.announcementId} data={announcement} />
              ))}
            </Stack>
          </>
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
      </Container>
      {/* this needs to be like this for hiding animation to work */}
      <AnnouncementResultListFilters
        params={params}
        onSubmit={(params) => {
          setParams(params);
          setShowFiltersDialog(false);
        }}
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
      />
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
