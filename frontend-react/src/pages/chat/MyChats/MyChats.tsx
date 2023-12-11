import { styled } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { ChatType } from 'src/models/chat/chat';
import { MyChatsActions } from 'src/pages/chat/MyChats/MyChatsActions';
import { MyChatsNewPrivateMessage } from 'src/pages/chat/MyChats/MyChatsNewPrivateMessage';
import { useGetUnreadChatsCount } from 'src/queries/chat-queries';
import { Box, Stack, Tab, Tabs } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const StyledDot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.error.main,
}));

export const MyChats = () => {
  const { unreadChatsCount } = useGetUnreadChatsCount();
  const location = useLocation();

  const getLabel = (type: ChatType) => {
    const hasUnread =
      type === ChatType.Private ? !!unreadChatsCount?.private : !!unreadChatsCount?.group;
    return (
      <Stack alignItems={'center'}>
        {type === ChatType.Private ? 'Prywatne' : 'Grupowe'} {hasUnread && <StyledDot ml={1} />}
      </Stack>
    );
  };

  return (
    <Stack height='100vh' direction='column'>
      <Header />
      <Stack position='relative' justifyContent='space-between' alignItems='center' pr={1}>
        <MyChatsNewPrivateMessage />
        <Tabs sx={{ borderBottom: 1, borderColor: 'divider' }} value={location.pathname}>
          <Tab
            label={getLabel(ChatType.Private)}
            component={Link}
            to={AppRoutes.MyChatsPrivate()}
            value={AppRoutes.MyChatsPrivate()}
          />
          <Tab
            label={getLabel(ChatType.Group)}
            component={Link}
            to={AppRoutes.MyChatsGroup()}
            value={AppRoutes.MyChatsGroup()}
          />
        </Tabs>
        <MyChatsActions />
      </Stack>
      <Box overflow='auto'>
        <Outlet />
      </Box>
    </Stack>
  );
};

MyChats.displayName = 'MyChats';
