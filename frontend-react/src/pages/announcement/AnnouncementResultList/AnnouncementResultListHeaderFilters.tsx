import { useSetAtom } from 'jotai';
import { TransitionProps } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AnnouncementResultListHeaderFiltersFormFields } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListHeaderFiltersFormFields';
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
  AnnouncementResultListQueryParams,
  areAnnouncementResultListFiltersDefault,
  getDefaultAnnouncementResultListQueryParams,
} from 'src/utils/announcement-filters-utils';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

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
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <AppBar sx={{ position: 'sticky' }}>
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
        <AnnouncementResultListHeaderFiltersFormFields form={form} />
      </Box>
    </Dialog>
  );
};
