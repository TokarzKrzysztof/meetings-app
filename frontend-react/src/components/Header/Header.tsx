import useScrollTrigger from '@mui/material/useScrollTrigger';
import { HeaderMenuButton } from 'src/components/Header/HeaderMenuButton/HeaderMenuButton';
import { AppBar, Slide, Toolbar } from 'src/ui-components';
import { PropsWithReactElement } from 'src/utils/types/props';

const HideOnScroll = ({ children }: PropsWithReactElement) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction={'down'} in={!trigger}>
      {children}
    </Slide>
  );
};

export type HeaderProps = {};

export const Header = ({ ...props }: HeaderProps) => {
  return (
    <>
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <HeaderMenuButton />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
