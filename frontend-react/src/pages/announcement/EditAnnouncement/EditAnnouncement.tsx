import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { Loader } from 'src/components/Loader';
import { Header } from 'src/components/header/Header';
import { useRouteParams } from 'src/hooks/useRouteParams';
import { Announcement } from 'src/models/annoucement/announcement';
import { AnnouncementForm } from 'src/pages/announcement/shared/AnnouncementForm';
import { useEditAnnouncement, useGetAnnouncement } from 'src/queries/announcement-queries';
import { EditAnnouncementParams } from 'src/utils/enums/app-routes';

export const EditAnnouncement = () => {
  const [params] = useRouteParams<EditAnnouncementParams>();
  const { announcement, announcementLoading } = useGetAnnouncement(params.id);
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
        navigate(-1);
      },
    });
  };

  return (
    <>
      <Header leftSlot={<GoBackBtn />} />
      {!announcementLoading ? (
        <AnnouncementForm
          data={announcement!}
          onSubmit={onSubmit}
          title='Edycja ogłoszenia'
          inProgress={editAnnouncementInProgress}
          buttonText='Zapisz zmiany'
          disabledWhenUntouched
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

EditAnnouncement.displayName = 'EditAnnouncement';
