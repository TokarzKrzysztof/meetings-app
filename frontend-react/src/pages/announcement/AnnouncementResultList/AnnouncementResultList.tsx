import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { AnnouncementResultListHeader } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListHeader';
import { AnnouncementResultListItem } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListItem';
import { AnnouncementResultListObserveSearch } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListObserveSearch';
import { useAnnouncementResultListQueryParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultQueryParams';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Container, Stack, Typography } from 'src/ui-components';
import { ResultListQueryParams } from 'src/utils/announcement-result-list-utils';

export const AnnouncementResultList = () => {
  const { allCategories } = useGetAllCategories();
  const [params, setParams] = useAnnouncementResultListQueryParams();
  const scrollable = window;

  const {
    announcementResultList,
    announcementResultListFetchNextPage,
    announcementResultListHasNextPage,
    announcementResultListFetching,
  } = useGetAnnouncementResultList(params);

  const updateQueryParams = (params: ResultListQueryParams) => {
    scrollable.scrollTo({ top: 0 });
    setParams(params);
  };

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <AnnouncementResultListHeader params={params} onUpdateQueryParams={updateQueryParams} />
      <Container>
        {announcementResultList?.length !== 0 ? (
          <Typography color={'black'}>
            Ogłoszenia z kategorii:{' '}
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{categoryName}</span>
          </Typography>
        ) : (
          <Box mt={4} textAlign='center' color='grey'>
            <Typography>
              Brak ogłoszeń z kategorii <br />
              <b>{categoryName}</b>
            </Typography>
            <Typography mt={1} fontSize={12}>
              Spróbuj zmnienić kryteria wyszukiwania
            </Typography>
          </Box>
        )}
        <Box textAlign={announcementResultList?.length !== 0 ? 'right' : 'center'} my={2}>
          <AnnouncementResultListObserveSearch params={params} />
        </Box>
        <Stack direction='column' gap={2}>
          <InfiniteScroll
            direction='down'
            next={announcementResultListFetchNextPage}
            hasMore={!!announcementResultListHasNextPage}
            scrollable={scrollable}
            isFetching={announcementResultListFetching}
          >
            {(announcementResultList ?? []).map((x) => (
              <AnnouncementResultListItem key={x.announcementId} data={x} />
            ))}
          </InfiniteScroll>
        </Stack>
      </Container>
    </>
  );
};

AnnouncementResultList.displayName = 'AnnouncementResultList';
