import { IconButton } from '@mui/material';
import { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import { EmojiSelectorPopper } from 'src/components/EmojiSelectorPopper/EmojiSelectorPopper';
import { Icon, IconButtonProps, IconProps } from 'src/ui-components';

export type EmojiPickerProps = {
  onEmojiSelected: (emoji: EmojiClickData, event: MouseEvent) => void;
  onOpen?: () => void;
  icon?: IconProps['name'];
  buttonSize?: IconButtonProps['size'];
  closeOnSelect?: boolean;
};

export const EmojiPicker = ({
  onEmojiSelected,
  onOpen,
  icon = 'tag_faces',
  buttonSize = 'medium',
  closeOnSelect = false
}: EmojiPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen && onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size={buttonSize} onClick={handleClick}>
        <Icon name={icon} />
      </IconButton>
      <EmojiSelectorPopper
        anchorEl={anchorEl}
        onClickAway={handleClose}
        onEmojiClick={(emoji, event) => {
          onEmojiSelected(emoji, event);
          closeOnSelect && handleClose();
        }}
      />
    </>
  );
};
