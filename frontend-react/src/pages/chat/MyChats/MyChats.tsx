import { Link, Outlet, useLocation } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { MyChatsActions } from 'src/pages/chat/MyChats/MyChatsActions';
import { MyChatsNewPrivateMessage } from 'src/pages/chat/MyChats/MyChatsNewPrivateMessage';
import { Box, Stack, Tab, Tabs } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyChats = () => {
  const location = useLocation();

  return (
    <Stack height={'100vh'} direction={'column'}>
      <Header />
      <Stack position={'relative'} justifyContent={'space-between'} alignItems={'center'} pr={1}>
        <MyChatsNewPrivateMessage />
        <Tabs sx={{ borderBottom: 1, borderColor: 'divider' }} value={location.pathname}>
          <Tab
            label='Prywatne'
            component={Link}
            to={AppRoutes.MyChatsPrivate()}
            value={AppRoutes.MyChatsPrivate()}
          />
          <Tab
            label='Grupowe'
            component={Link}
            to={AppRoutes.MyChatsGroup()}
            value={AppRoutes.MyChatsGroup()}
          />
        </Tabs>
        <MyChatsActions />
      </Stack>
      <Box overflow={'auto'}>
        <Outlet />
      </Box>
    </Stack>
  );
};

MyChats.displayName = 'MyChats';
