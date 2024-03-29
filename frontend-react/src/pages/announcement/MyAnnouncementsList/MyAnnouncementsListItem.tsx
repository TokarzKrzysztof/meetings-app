import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExperienceLevel } from 'src/components/ExperienceLevel';
import { Announcement, AnnouncementStatus } from 'src/models/annoucement/announcement';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useRemoveAnnouncement, useSetAnnouncementStatus } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Box, Button, Card, DialogContentText, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyAnnouncementsListItemProps = {
  announcement: Announcement;
  onReload: () => void;
};

export const MyAnnouncementsListItem = ({
  announcement,
  onReload,
}: MyAnnouncementsListItemProps) => {
  const { allCategories } = useGetAllCategories();
  const { setAnnouncementStatus } = useSetAnnouncementStatus();
  const { removeAnnouncement } = useRemoveAnnouncement();
  const confirm = useSetAtom(confirmationDialogAtom);
  const { enqueueSnackbar } = useSnackbar();

  const categoryName = allCategories?.find((x) => x.id === announcement.categoryId)!.name ?? '';

  const announcementStatus = useMemo(() => {
    if (announcement.status === AnnouncementStatus.Active)
      return <Typography color='green'>Aktywne</Typography>;
    if (announcement.status === AnnouncementStatus.Pending)
      return <Typography color='orange'>Oczekujące</Typography>;
    return <Typography color='grey'>Zakończone</Typography>;
  }, [announcement]);

  const handleSetAnnouncementAsClosed = () => {
    confirm({
      message: (
        <DialogContentText>
          Czy na pewno chcesz zakończyć ogłoszenie z kategorii "{categoryName}"? Ogłoszenie będzie
          można później aktywować.
        </DialogContentText>
      ),
      onAccept: () =>
        setAnnouncementStatus(
          { id: announcement.id, newStatus: AnnouncementStatus.Closed },
          {
            onSuccess: () => {
              enqueueSnackbar({
                variant: 'success',
                message: 'Ogłoszenie zostało zakończone',
              });
              onReload();
            },
          }
        ),
    });
  };

  const handleSetAnnouncementAsPending = () => {
    confirm({
      message: (
        <DialogContentText>
          Czy na pewno chcesz aktywować ogłoszenie z kategorii "{categoryName}"?
        </DialogContentText>
      ),
      onAccept: () =>
        setAnnouncementStatus(
          { id: announcement.id, newStatus: AnnouncementStatus.Pending },
          {
            onSuccess: () => {
              enqueueSnackbar({
                variant: 'success',
                message: 'Ogłoszenie zostało ponownie aktywowane',
              });
              onReload();
            },
          }
        ),
    });
  };

  const handleRemoveAnnouncement = () => {
    confirm({
      message: (
        <DialogContentText>
          Czy na pewno chcesz usunąć ogłoszenie z kategorii "{categoryName}"? Akcja jest
          nieodwracalna.
        </DialogContentText>
      ),
      onAccept: () =>
        removeAnnouncement(announcement.id, {
          onSuccess: () => {
            enqueueSnackbar({
              variant: 'success',
              message: 'Ogłoszenie zostało usunięte',
            });
            onReload();
          },
        }),
    });
  };

  return (
    <Card>
      <Stack justifyContent='space-between' alignItems='center' p={1}>
        <Box>
          <Typography fontWeight='bold'>{categoryName}</Typography>
          <ExperienceLevel level={announcement.experienceLevel} />
        </Box>
        {announcementStatus}
      </Stack>

      <Typography
        p={1}
        whiteSpace='nowrap'
        textOverflow='ellipsis'
        overflow='hidden'
        sx={{
          opacity: 0.5,
        }}
      >
        {announcement.description}
      </Typography>
      <Divider />
      <Stack pl={1} justifyContent='space-between' alignItems='center'>
        <Typography fontSize={12}>{dayjs(announcement.createdAt).format('DD.MM.YYYY')}</Typography>
        <Box>
          {announcement.status === AnnouncementStatus.Active ||
          announcement.status === AnnouncementStatus.Pending ? (
            <>
              <Button
                size='small'
                variant='text'
                component={Link}
                to={AppRoutes.EditAnnouncement({ id: announcement.id })}
              >
                Edytuj
              </Button>
              <Button
                size='small'
                color='error'
                variant='text'
                onClick={handleSetAnnouncementAsClosed}
              >
                Zakończ
              </Button>
            </>
          ) : (
            <>
              <Button size='small' variant='text' onClick={handleSetAnnouncementAsPending}>
                Aktywuj
              </Button>
              <Button size='small' color='error' variant='text' onClick={handleRemoveAnnouncement}>
                Usuń
              </Button>
            </>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
