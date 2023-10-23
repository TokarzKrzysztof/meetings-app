import { ClickAwayListener, IconButton } from '@mui/material';
import Picker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useState } from 'react';
import { Box, Icon, Popper } from 'src/ui-components';

export type EmojiPickerProps = {
  onEmojiSelected: (emoji: EmojiClickData, event: MouseEvent) => void;
};

export const EmojiPicker = ({ onEmojiSelected }: EmojiPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton disableRipple onClick={handleClick}>
        <Icon name='tag_faces' />
      </IconButton>
      <Popper open={!!anchorEl} anchorEl={anchorEl} placement='bottom-end'>
        <ClickAwayListener onClickAway={handleClose}>
          {/* Box to make click away work because of ref */}
          <Box>
            <Picker
              searchPlaceholder='Wyszukaj'
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={(emoji, event) => {
                handleClose();
                onEmojiSelected(emoji, event);
              }}
            />
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
};
