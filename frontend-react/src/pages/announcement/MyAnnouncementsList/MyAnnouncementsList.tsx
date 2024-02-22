import { useMemo } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { AnnouncementStatus } from 'src/models/annoucement/announcement';
import { MyAnnouncementsListItem } from 'src/pages/announcement/MyAnnouncementsList/MyAnnouncementsListItem';
import { useGetCurrentUserAnnouncements } from 'src/queries/announcement-queries';
import { Container, Stack, Typography } from 'src/ui-components';
import { MyAnnouncementsListParams } from 'src/utils/enums/app-routes';

export const MyAnnouncementsList = () => {
  const params = useRouteParams<MyAnnouncementsListParams>();

  const {
    currentUserAnnouncements,
    currentUserAnnouncementsFetchNextPage,
    currentUserAnnouncementsHasNextPage,
    currentUserAnnouncementsFetching,
    currentUserAnnouncementsRefetch,
  } = useGetCurrentUserAnnouncements(AnnouncementStatus[params.status]);

  const { title, noAnnoucementsText } = useMemo(() => {
    if (params.status === 'Active') {
      return {
        title: 'Aktywne',
        noAnnoucementsText: 'Brak aktywnych ogłoszeń',
      };
    }
    if (params.status === 'Pending') {
      return {
        title: 'Oczekujące',
        noAnnoucementsText: 'Brak oczekujących ogłoszeń',
      };
    }
    return {
      title: 'Zakończone',
      noAnnoucementsText: 'Brak zakończonych ogłoszeń',
    };
  }, [params]);

  if (!currentUserAnnouncements) return null;
  return (
    <>
      <Header leftSlot={<GoBackBtn text={title} />} />
      <Container sx={{ py: 2 }} maxWidth='sm'>
        <Stack direction='column' gap={2}>
          <InfiniteScroll
            next={currentUserAnnouncementsFetchNextPage}
            hasMore={!!currentUserAnnouncementsHasNextPage}
            direction={'down'}
            isFetching={currentUserAnnouncementsFetching}
          >
            {currentUserAnnouncements.map((x) => (
              <MyAnnouncementsListItem
                key={x.id}
                announcement={x}
                onReload={currentUserAnnouncementsRefetch}
              ></MyAnnouncementsListItem>
            ))}
          </InfiniteScroll>
        </Stack>
        {!currentUserAnnouncementsFetching && !currentUserAnnouncements.length && (
          <Typography textAlign='center' color='grey'>
            {noAnnoucementsText}
          </Typography>
        )}
      </Container>
    </>
  );
};

MyAnnouncementsList.displayName = 'MyAnnouncementsList';
