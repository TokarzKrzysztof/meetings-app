import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { AnnouncementForm } from 'src/components/AnnouncementForm/AnnouncementForm';
import { Header } from 'src/components/Header/Header';
import { Announcement } from 'src/models/annoucement/announcement';
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
        navigate(AppRoutes.MyAnnouncements);
      },
    });
  };

  return (
    <>
      <Header />
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
