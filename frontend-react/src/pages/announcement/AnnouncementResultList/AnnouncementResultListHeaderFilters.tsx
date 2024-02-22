import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FullscreenDialog } from 'src/components/FullscreenDialog';
import { AnnouncementResultListHeaderFiltersFormFields } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListHeaderFiltersFormFields';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import {
  DialogContentText
} from 'src/ui-components';
import {
  AnnouncementResultListQueryParams,
  areAnnouncementResultListFiltersDefault,
  getDefaultAnnouncementResultListQueryParams,
} from 'src/utils/announcement-filters-utils';

export type AnnouncementResultListHeaderFiltersProps = {
  open: boolean;
  params: AnnouncementResultListQueryParams;
  onSubmit: (data: AnnouncementResultListQueryParams) => void;
  onClose: () => void;
};

export const AnnouncementResultListHeaderFilters = ({
  open,
  params,
  onSubmit,
  onClose,
}: AnnouncementResultListHeaderFiltersProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const form = useForm<AnnouncementResultListQueryParams>();
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (open) reset(params);
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleClearFilters = () => {
    confirm({
      message: (
        <DialogContentText>Czy na pewno chcesz wyczyścić filtry wyszukiwania?</DialogContentText>
      ),
      onAccept: () => onSubmit(getDefaultAnnouncementResultListQueryParams(params.categoryId)),
    });
  };

  const areParamsDefault = useMemo(() => areAnnouncementResultListFiltersDefault(params), [params]);
  return (
    <FullscreenDialog
      open={open}
      onClose={handleClose}
      onSave={handleSubmit(onSubmit)}
      title='Filtry'
      saveDisabled={!isDirty}
      onClear={!areParamsDefault ? handleClearFilters : undefined}
    >
      <AnnouncementResultListHeaderFiltersFormFields form={form} />
    </FullscreenDialog>
  );
};
