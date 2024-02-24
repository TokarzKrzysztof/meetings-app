import { TransitionProps } from 'notistack';
import { ReactNode, forwardRef } from 'react';
import {
  AppBar,
  Button,
  Dialog,
  Icon,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from 'src/ui-components';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export type FullscreenDialogProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  title?: ReactNode;
  saveDisabled?: boolean;
  saveButtonText?: string;
  onClear?: () => void;
};

export const FullscreenDialog = ({
  open,
  onClose,
  onSave,
  children,
  title,
  saveDisabled,
  saveButtonText,
  onClear,
  ...props
}: FullscreenDialogProps) => {
  return (
    <Dialog open={open} fullScreen TransitionComponent={Transition} onClose={onClose} {...props}>
      <AppBar sx={{ position: 'sticky' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack alignItems={'center'}>
            <IconButton color='inherit' onClick={onClose}>
              <Icon name='close' />
            </IconButton>
            {title && (
              <Typography ml={2} variant='h6'>
                {title}
              </Typography>
            )}
          </Stack>
          <Stack alignItems={'center'}>
            {onClear && (
              <Button color='inherit' variant='text' onClick={onClear}>
                WYCZYŚĆ
              </Button>
            )}
            <Button
              type='submit'
              color='inherit'
              variant='text'
              disabled={saveDisabled}
              onClick={onSave}
            >
              {saveButtonText ?? 'ZAPISZ'}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};
