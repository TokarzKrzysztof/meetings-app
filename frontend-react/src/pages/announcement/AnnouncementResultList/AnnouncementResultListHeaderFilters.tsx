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
  ResultListQueryParams,
  areResultListQueryParamsDefault,
  getDefaultResultListQueryParams,
} from 'src/utils/announcement-result-list-utils';

export type AnnouncementResultListHeaderFiltersProps = {
  open: boolean;
  params: ResultListQueryParams;
  onSubmit: (data: ResultListQueryParams) => void;
  onClose: () => void;
};

export const AnnouncementResultListHeaderFilters = ({
  open,
  params,
  onSubmit,
  onClose,
}: AnnouncementResultListHeaderFiltersProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const form = useForm<ResultListQueryParams>();
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
      onAccept: () => onSubmit(getDefaultResultListQueryParams(params.categoryId)),
    });
  };

  const areParamsDefault = useMemo(() => areResultListQueryParamsDefault(params), [params]);
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
