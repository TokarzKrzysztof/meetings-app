import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnnouncementForm } from 'src/components/AnnouncementForm/AnnouncementForm';
import { Header } from 'src/components/Header/Header';
import { Announcement } from 'src/models/annoucement/announcement';
import { useEditAnnouncement, useGetAnnouncement } from 'src/queries/announcement-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const EditAnnouncement = () => {
  const [searchParams] = useSearchParams();
  const { announcement } = useGetAnnouncement(searchParams.get('id')!);
  const { editAnnouncement, editAnnouncementInProgress } = useEditAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = (data: Announcement) => {
    editAnnouncement(data, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'success',
          message: 'Ogłoszenie zostało zmienione',
        });
        navigate(AppRoutes.MyAnnouncements);
      },
    });
  };

  return (
    <>
      <Header />
      <AnnouncementForm
        data={announcement}
        onSubmit={onSubmit}
        title='Edycja ogłoszenia'
        inProgress={editAnnouncementInProgress}
        buttonText='Zapisz zmiany'
        disabledWhenUntouched
      />
    </>
  );
};

EditAnnouncement.displayName = 'EditAnnouncement';
