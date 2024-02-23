import { atom, useAtom } from 'jotai';
import _ from 'lodash';
import { ChangeEvent, useMemo } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { InfiniteScroll } from 'src/components/InfiniteScroll';
import { Loader } from 'src/components/Loader';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { AnnouncementStatus } from 'src/models/annoucement/announcement';
import { MyAnnouncementsListItem } from 'src/pages/announcement/MyAnnouncementsList/MyAnnouncementsListItem';
import { useGetCurrentUserAnnouncements } from 'src/queries/announcement-queries';
import { Container, Stack, TextField, Toolbar, Typography } from 'src/ui-components';
import { MyAnnouncementsListParams } from 'src/utils/enums/app-routes';

export const announcementsFilterAtom = atom('');

export const MyAnnouncementsList = () => {
  const [params] = useRouteParams<MyAnnouncementsListParams>();
  const [filter, setFilter] = useAtom(announcementsFilterAtom);

  const {
    currentUserAnnouncements,
    currentUserAnnouncementsFetchNextPage,
    currentUserAnnouncementsHasNextPage,
    currentUserAnnouncementsFetching,
    currentUserAnnouncementsRefetch,
  } = useGetCurrentUserAnnouncements(AnnouncementStatus[params.status], filter);

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

  const onFilterDebounce = useMemo(() => {
    return _.debounce((e: ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);
    }, 500);
  }, [params]);

  return (
    <>
      <Header
        leftSlot={<GoBackBtn text={title} />}
        secondToolbar={
          <Toolbar sx={{ backgroundColor: 'white' }}>
            <TextField
              size='small'
              placeholder='Wyszukaj po opisie lub kategorii...'
              variant='outlined'
              fullWidth
              onChange={onFilterDebounce}
              defaultValue={filter}
            ></TextField>
          </Toolbar>
        }
      />
      <Container maxWidth='sm'>
        {currentUserAnnouncements ? (
          <>
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
            {!currentUserAnnouncements.length && (
              <Typography textAlign='center' color='grey'>
                {noAnnoucementsText}
              </Typography>
            )}
          </>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
};

MyAnnouncementsList.displayName = 'MyAnnouncementsList';
