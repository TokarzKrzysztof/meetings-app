import useScrollTrigger from '@mui/material/useScrollTrigger';
import { ReactElement, ReactNode, cloneElement } from 'react';
import { Link } from 'react-router-dom';
import { HeaderMenu } from 'src/components/header/HeaderMenu';
import { AppBar, Box, Slide, Toolbar } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { PropsWithReactElement } from 'src/utils/types/props';

const HideOnScroll = ({ children }: PropsWithReactElement) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
};

export type HeaderProps = {
  leftSlot?: ReactNode;
  secondToolbar?: ReactElement;
};

export const Header = ({ leftSlot, secondToolbar }: HeaderProps) => {
  return (
    <>
      <HideOnScroll>
        <AppBar>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box>
              {leftSlot ?? (
                <Box component={Link} to={AppRoutes.Home()} color='white'>
                  Logo
                </Box>
              )}
            </Box>
            <Box>
              <HeaderMenu />
            </Box>
          </Toolbar>
          {secondToolbar}
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      {secondToolbar && cloneElement(secondToolbar, { children: null })}
    </>
  );
};
