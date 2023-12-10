import { ReactNode } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { AppBar, Toolbar } from 'src/ui-components';

export type ChatHeaderProps = {
  right: ReactNode;
};

export const ChatHeader = ({ right }: ChatHeaderProps) => {
  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <GoBackBtn />
        {right}
      </Toolbar>
    </AppBar>
  );
};
