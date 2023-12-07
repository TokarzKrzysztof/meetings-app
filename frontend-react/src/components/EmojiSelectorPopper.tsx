import { ClickAwayListener, ClickAwayListenerProps } from '@mui/material';
import Picker, { EmojiStyle, PickerProps } from 'emoji-picker-react';
import { Box, Popper } from 'src/ui-components';

export type EmojiSelectorPopperProps = {
  anchorEl: HTMLButtonElement | null;
  onClickAway: ClickAwayListenerProps['onClickAway'];
  onEmojiClick: PickerProps['onEmojiClick'];
};

export const EmojiSelectorPopper = ({
  anchorEl,
  onClickAway,
  onEmojiClick,
}: EmojiSelectorPopperProps) => {
  return (
    <Popper
      open={!!anchorEl}
      anchorEl={anchorEl}
      placement='bottom-end'
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        {/* Box to make click away work because of ref */}
        <Box>
          <Picker
            searchPlaceholder='Wyszukaj'
            emojiStyle={EmojiStyle.NATIVE}
            width='100%'
            onEmojiClick={onEmojiClick}
          />
        </Box>
      </ClickAwayListener>
    </Popper>
  );
};
