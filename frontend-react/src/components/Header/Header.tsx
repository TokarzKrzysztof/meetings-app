import useScrollTrigger from '@mui/material/useScrollTrigger';
import { ReactNode } from 'react';
import { HeaderMenu } from 'src/components/Header/HeaderMenu/HeaderMenu';
import { AppBar, Box, Slide, Toolbar } from 'src/ui-components';
import { PropsWithReactElement } from 'src/utils/types/props';

const HideOnScroll = ({ children }: PropsWithReactElement) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction={'down'} in={!trigger}>
      {children}
    </Slide>
  );
};

export type HeaderProps = {
  leftSlot?: ReactNode;
};

export const Header = ({ leftSlot }: HeaderProps) => {
  return (
    <>
      <HideOnScroll>
        <AppBar>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>{leftSlot}</Box>
            <Box>
              <HeaderMenu />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
