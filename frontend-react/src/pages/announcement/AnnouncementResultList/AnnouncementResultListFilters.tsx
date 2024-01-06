import { TransitionProps } from 'notistack';
import React from 'react';
import {
  AppBar,
  Button,
  Dialog,
  Icon,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography
} from 'src/ui-components';

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
  onClose: () => void;
};

export const AnnouncementResultListFilters = ({
  open,
  onClose,
}: AnnouncementResultListFiltersProps) => {
  const onAccept = () => {
    onClose();
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack alignItems={'center'}>
            <IconButton onClick={onClose} color='inherit'>
              <Icon name='close' />
            </IconButton>
            <Typography ml={2} variant='h6'>
              Filtry
            </Typography>
          </Stack>
          <Button onClick={onAccept} color='inherit' variant='text'>
            ZAPISZ
          </Button>
        </Toolbar>
      </AppBar>
    </Dialog>
  );
};
