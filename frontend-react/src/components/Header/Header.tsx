import { ReactElement, ReactNode, cloneElement, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeaderMenu } from 'src/components/header/HeaderMenu';
import { AppBar, Box, Slide, Toolbar } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { PropsWithReactElement } from 'src/utils/types/props';

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

const HideOnScroll = ({ children }: PropsWithReactElement) => {
  const ignoreRef = useRef(true);
  const prevScrollYRef = useRef(window.scrollY);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // timeout when navigation back happen to ignore first router scroll event
    setTimeout(() => {
      ignoreRef.current = false;
    });

    const handler = () => {
      if (!ignoreRef.current) {
        const threshold = 100;
        setShow(window.scrollY < threshold || prevScrollYRef.current > window.scrollY);
        prevScrollYRef.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handler);
    return () => {
      window?.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <Slide appear={false} direction='down' in={show}>
      {children}
    </Slide>
  );
};
