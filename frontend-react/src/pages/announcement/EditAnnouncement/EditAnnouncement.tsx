import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Announcement } from 'src/models/annoucement/announcement';
import { AnnouncementForm } from 'src/pages/announcement/shared/AnnouncementForm';
import { useEditAnnouncement, useGetAnnouncement } from 'src/queries/announcement-queries';
import { AppRoutes, EditAnnouncementParams } from 'src/utils/enums/app-routes';

export const EditAnnouncement = () => {
  const [params] = useRouteParams<EditAnnouncementParams>();
  const { announcement } = useGetAnnouncement(params.id);
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
        navigate(AppRoutes.MyAnnouncements());
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
