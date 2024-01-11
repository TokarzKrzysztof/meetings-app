import { useRef, useState } from 'react';
import { InfiniteScroll, InfiniteScrollHandle } from 'src/components/InfiniteScroll';
import { Header } from 'src/components/header/Header';
import { AnnouncementResultListItem } from 'src/models/annoucement/announcement-result-list';
import { AnnouncementResultListAnnouncement } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListAnnouncement';
import { AnnouncementResultListFilters } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListFilters';
import { useAnnouncementResultListQueryParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultQueryParams';
import { useLoadAnnouncementResultList } from 'src/queries/announcement-queries';
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
import {
  AnnouncementResultListQueryParams,
  SortOption,
} from 'src/utils/announcement-filters-utils';

export const AnnouncementResultList = () => {
  const pageSize = 10;
  const infiniteScrollRef = useRef<InfiniteScrollHandle>(null);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const { allCategories } = useGetAllCategories();
  const [params, setParams] = useAnnouncementResultListQueryParams();
  const [announcements, setAnnouncements] = useState<AnnouncementResultListItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(pageSize);
  const { loadAnnouncementResultListAsync } = useLoadAnnouncementResultList();

  const handleLoadAnnouncements = async () => {
    const result = await loadAnnouncementResultListAsync({
      ...params,
      skip: announcements.length,
      take: pageSize,
    });

    setAnnouncements((prev) => prev.concat(result.data));
    setTotalAmount(result.totalCount);
  };

  const updateQueryParams = (params: AnnouncementResultListQueryParams) => {
    setParams(params);
    setAnnouncements([]);
    // timeout to wait for setAnnouncements
    setTimeout(() => {
      console.log('next from parent');
      infiniteScrollRef.current?.load();
    });
  };

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
                onChange: (e) =>
                  updateQueryParams({ ...params, sortBy: e.target.value as SortOption }),
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
        {totalAmount !== 0 ? (
          <Typography color={'black'} my={2}>
            Ogłoszenia z kategorii:{' '}
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
          </Typography>
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
        <Stack direction='column' gap={2} py={2}>
          <InfiniteScroll
            ref={infiniteScrollRef}
            direction='down'
            totalAmount={totalAmount}
            next={handleLoadAnnouncements}
          >
            {announcements.map((x) => (
              <AnnouncementResultListAnnouncement key={x.announcementId} data={x} />
            ))}
          </InfiniteScroll>
        </Stack>
      </Container>
      {/* this needs to be like this for hiding animation to work */}
      <AnnouncementResultListFilters
        params={params}
        onSubmit={(params) => {
          updateQueryParams(params);
          setShowFiltersDialog(false);
        }}
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
      />
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
