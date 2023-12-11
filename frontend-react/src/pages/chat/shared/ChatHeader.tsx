import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { AppBar, Box, Toolbar } from 'src/ui-components';

const StyledRightSideWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  overflow: 'hidden',
  '.MuiTypography-root': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export type ChatHeaderProps = {
  right: ReactNode;
};

export const ChatHeader = ({ right }: ChatHeaderProps) => {
  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <GoBackBtn />
        <StyledRightSideWrapper>{right}</StyledRightSideWrapper>
      </Toolbar>
    </AppBar>
  );
};
