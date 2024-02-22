import { default as MuiMenu, MenuProps as MuiMenuProps } from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { RefObject, useEffect, useState } from 'react';

const StyledMenu = styled(MuiMenu)({
  '& .MuiList-root': {
    padding: 0,
  },
  '& .MuiMenuItem-root': {
    fontSize: 13,
  },
});

type MenuProps = Omit<MuiMenuProps, 'open'> & {
  anchorRef: RefObject<HTMLElement>;
};
export const Menu = ({ children, anchorRef, ...props }: MenuProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    anchorRef.current?.addEventListener('click', () => {
      setOpen(true);
    });
  }, [anchorRef.current]);

  return (
    <StyledMenu anchorEl={anchorRef.current} open={open} onClose={handleClose} {...props}>
      <div onClick={handleClose}>{children}</div>
    </StyledMenu>
  );
};
