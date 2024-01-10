import { TransitionProps } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AnnouncementResultListFiltersFormFields } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListFiltersFormFields';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Icon,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from 'src/ui-components';
import { AnnouncementResultListParams } from 'src/utils/announcement-utils';

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
  setParams: (params: AnnouncementResultListParams) => void;
  onClose: () => void;
};

export const AnnouncementResultListFilters = ({
  open,
  params,
  setParams,
  onClose,
}: AnnouncementResultListFiltersProps) => {
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

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Box component='form' onSubmit={handleSubmit(setParams)}>
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
            <Button type='submit' color='inherit' variant='text' disabled={!isDirty}>
              ZAPISZ
            </Button>
          </Toolbar>
        </AppBar>
        <AnnouncementResultListFiltersFormFields form={form} />
      </Box>
    </Dialog>
  );
};
