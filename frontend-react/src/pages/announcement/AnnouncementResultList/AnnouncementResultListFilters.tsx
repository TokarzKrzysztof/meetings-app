import { useSetAtom } from 'jotai';
import { TransitionProps } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnnouncementResultListFiltersFormFields } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListFiltersFormFields';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContentText,
  Icon,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from 'src/ui-components';
import {
  AnnouncementResultListParams,
  areAnnouncementResultListParamsDefault,
  getDefaultAnnouncementResultListParams,
} from 'src/utils/announcement-filters-utils';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export type AnnouncementResultListFiltersProps = {
  open: boolean;
  params: AnnouncementResultListParams;
  onSubmit: (data: AnnouncementResultListParams) => void;
  onClose: () => void;
};

export const AnnouncementResultListFilters = ({
  open,
  params,
  onSubmit,
  onClose,
}: AnnouncementResultListFiltersProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const form = useForm<AnnouncementResultListParams>();
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
      onAccept: () => onSubmit(getDefaultAnnouncementResultListParams(params.categoryId)),
    });
  };

  const areParamsDefault = useMemo(() => areAnnouncementResultListParamsDefault(params), [params]);
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Stack alignItems={'center'}>
              <IconButton color='inherit' onClick={handleClose}>
                <Icon name='close' />
              </IconButton>
              <Typography ml={2} variant='h6'>
                Filtry
              </Typography>
            </Stack>
            <Stack alignItems={'center'}>
              {!areParamsDefault && (
                <Button color='inherit' variant='text' onClick={handleClearFilters}>
                  WYCZYŚĆ
                </Button>
              )}
              <Button type='submit' color='inherit' variant='text' disabled={!isDirty}>
                ZAPISZ
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <AnnouncementResultListFiltersFormFields form={form} />
      </Box>
    </Dialog>
  );
};
