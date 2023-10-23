import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Announcement, AnnouncementStatus } from 'src/models/announcement';
import {
  useGetCurrentUserAnnouncements,
  useRemoveAnnouncement,
  useSetAnnouncementStatus,
} from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { confirmationDialogAtom } from 'src/store/atoms';
import { Box, Button, Card, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyAnnouncementsListItemProps = {
  announcement: Announcement;
};

export const MyAnnouncementsListItem = ({
  announcement,
}: MyAnnouncementsListItemProps) => {
  const { allCategories } = useGetAllCategories();
  const { currentUserAnnoucementsRefetch } = useGetCurrentUserAnnouncements({
    enabled: false,
  });
  const { setAnnouncementStatus } = useSetAnnouncementStatus();
  const { removeAnnouncement } = useRemoveAnnouncement();
  const confirm = useSetAtom(confirmationDialogAtom);
  const { enqueueSnackbar } = useSnackbar();

  const categoryName = allCategories!.find(
    (x) => x.id === announcement.categoryId
  )!.name;

  const announcementStatus = useMemo(() => {
    if (announcement.status === AnnouncementStatus.Active)
      return <Typography color='green'>Aktywne</Typography>;
    if (announcement.status === AnnouncementStatus.Pending)
      return <Typography color='orange'>Oczekujące</Typography>;
    return <Typography color='grey'>Zakończone</Typography>;
  }, [announcement]);

  const handleConfirmSetAnnouncementAsClosed = () => {
    confirm({
      message: `Czy na pewno chcesz zakończyć ogłoszenie z kategorii "${categoryName}"? Ogłoszenie będzie można później aktywować.`,
      onAccept: handleSetAnnouncementAsClosed,
    });
  };
  const handleSetAnnouncementAsClosed = () => {
    setAnnouncementStatus(
      { id: announcement.id, newStatus: AnnouncementStatus.Closed },
      {
        onSuccess: () => {
          enqueueSnackbar({
            variant: 'success',
            message: 'Ogłoszenie zostało zakończone',
          });
          currentUserAnnoucementsRefetch();
        },
      }
    );
  };

  const handleConfirmSetAnnouncementAsPending = () => {
    confirm({
      message: `Czy na pewno chcesz aktywować ogłoszenie z kategorii "${categoryName}"?`,
      onAccept: handleSetAnnouncementAsPending,
    });
  };
  const handleSetAnnouncementAsPending = () => {
    setAnnouncementStatus(
      { id: announcement.id, newStatus: AnnouncementStatus.Pending },
      {
        onSuccess: () => {
          enqueueSnackbar({
            variant: 'success',
            message: 'Ogłoszenie zostało ponownie aktywowane',
          });
          currentUserAnnoucementsRefetch();
        },
      }
    );
  };

  const handleConfirmRemoveAnnouncement = () => {
    confirm({
      message: `Czy na pewno chcesz usunąć ogłoszenie z kategorii "${categoryName}"? Akcja jest nieodwracalna.`,
      onAccept: handleRemoveAnnouncement,
    });
  };
  const handleRemoveAnnouncement = () => {
    removeAnnouncement(announcement.id, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'success',
          message: 'Ogłoszenie zostało usunięte',
        });
        currentUserAnnoucementsRefetch();
      },
    });
  };

  return (
    <Card>
      <Stack justifyContent='space-between' alignItems='center' p={1}>
        <Typography fontWeight='bold'>{categoryName}</Typography>
        {announcementStatus}
      </Stack>
      <Typography
        p={1}
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          opacity: 0.5,
        }}
      >
        {announcement.description}
      </Typography>
      <Divider />
      <Stack pl={1} justifyContent='space-between' alignItems='center'>
        <Typography fontSize={12}>
          {dayjs(announcement.createdAt).format('DD.MM.YYYY')}
        </Typography>
        <Box>
          {announcement.status === AnnouncementStatus.Active ||
          announcement.status === AnnouncementStatus.Pending ? (
            <>
              <Button
                size='small'
                variant='text'
                component={Link}
                to={`${AppRoutes.EditAnnouncement}?id=${announcement.id}`}
              >
                Edytuj
              </Button>
              <Button
                size='small'
                color='error'
                variant='text'
                onClick={handleConfirmSetAnnouncementAsClosed}
              >
                Zakończ
              </Button>
            </>
          ) : (
            <>
              <Button
                size='small'
                variant='text'
                onClick={handleConfirmSetAnnouncementAsPending}
              >
                Aktywuj
              </Button>
              <Button
                size='small'
                color='error'
                variant='text'
                onClick={handleConfirmRemoveAnnouncement}
              >
                Usuń
              </Button>
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
