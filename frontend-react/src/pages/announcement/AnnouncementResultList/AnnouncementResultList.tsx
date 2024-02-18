import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { AnnouncementResultListHeader } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListHeader';
import { AnnouncementResultListItem } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListItem';
import { useAnnouncementResultListQueryParams } from 'src/pages/announcement/AnnouncementResultList/hooks/useAnnouncementResultQueryParams';
import { useGetAnnouncementResultList } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Container, Stack, Typography } from 'src/ui-components';
import { AnnouncementResultListQueryParams } from 'src/utils/announcement-filters-utils';

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

  const updateQueryParams = (params: AnnouncementResultListQueryParams) => {
    scrollable.scrollTo({ top: 0 });
    setParams(params);
  };

  const categoryName = allCategories?.find((x) => x.id === params.categoryId)?.name;
  return (
    <>
      <AnnouncementResultListHeader params={params} onUpdateQueryParams={updateQueryParams} />
      <Container>
        {announcementResultList?.length !== 0 ? (
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
