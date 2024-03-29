import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { GoBackBtn } from 'src/components/GoBackBtn';
import { AppBar, Box, Toolbar } from 'src/ui-components';

const StyledRightSideWrapper = styled(Box)(({ theme }) => ({
  // padding to not clip active dot because of overflow
  padding: '5px 0',
  marginLeft: theme.spacing(2),
  overflow: 'hidden',
  '.MuiTypography-root': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
}));

export type ChatHeaderProps = {
  right: ReactNode;
  returnUrl?: string;
};

export const ChatHeader = ({ right, returnUrl }: ChatHeaderProps) => {
  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <GoBackBtn returnUrl={returnUrl}/>
        <StyledRightSideWrapper>{right}</StyledRightSideWrapper>
      </Toolbar>
    </AppBar>
  );
};
