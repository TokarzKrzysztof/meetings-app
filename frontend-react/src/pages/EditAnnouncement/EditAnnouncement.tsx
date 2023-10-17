import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AnnouncementForm,
  AnnouncementFormData,
} from 'src/components/AnnouncementForm/AnnouncementForm';
import { Header } from 'src/components/Header/Header';
import {
  useEditAnnouncement,
  useGetAnnouncement,
} from 'src/queries/announcement-queries';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const EditAnnouncement = () => {
  const [searchParams] = useSearchParams();
  const { announcement } = useGetAnnouncement(searchParams.get('id')!);
  const { editAnnouncement, editAnnouncementInProgress } =
    useEditAnnouncement();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = (data: AnnouncementFormData) => {
    editAnnouncement(
      {
        ...announcement!,
        description: data.description,
        categoryId: data.category.id,
      },
      {
        onSuccess: () => {
          enqueueSnackbar({
            variant: 'success',
            message: 'Ogłoszenie zostało zmienione',
          });
          navigate(AppRoutes.MyAnnouncements);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate(AppRoutes.MyAnnouncements);
  };

  return (
    <>
      <Header />
      <AnnouncementForm
        data={announcement}
        onSubmit={onSubmit}
        title={'Edycja ogłoszenia'}
        inProgress={editAnnouncementInProgress}
        buttonText={'Zapisz zmiany'}
        onCancel={handleCancel}
        disabledWhenUntouched
      />
    </>
  );
};

EditAnnouncement.displayName = 'EditAnnouncement';
