import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';
import { Announcement } from 'src/models/annoucement/announcement';
import { AnnouncementForm } from 'src/pages/announcement/shared/AnnouncementForm';
import { useCreateNewAnnouncement } from 'src/queries/announcement-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const NewAnnouncement = () => {
  const { createNewAnnouncement, createNewAnnouncementInProgress } = useCreateNewAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = (data: Announcement) => {
    createNewAnnouncement(data, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'success',
          message: 'Ogłoszenie zostało dodane',
        });
        navigate(AppRoutes.MyAnnouncements());
      },
    });
  };

  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      <AnnouncementForm
        onSubmit={onSubmit}
        title='Nowe ogłoszenie'
        inProgress={createNewAnnouncementInProgress}
        buttonText='Dodaj ogłoszenie'
      />
    </>
  );
};

NewAnnouncement.displayName = 'NewAnnouncement';
