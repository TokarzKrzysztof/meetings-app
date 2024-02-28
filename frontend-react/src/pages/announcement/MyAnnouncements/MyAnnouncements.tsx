import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { announcementsFilterAtom } from 'src/pages/announcement/MyAnnouncementsList/MyAnnouncementsList';
import {
  AnnouncementsCount,
  useGetCurrentUserAnnouncementsCount,
} from 'src/queries/announcement-queries';
import {
  Box,
  Button,
  Container,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from 'src/ui-components';
import { AppRoutes, MyAnnouncementsListParams } from 'src/utils/enums/app-routes';

export const MyAnnouncements = () => {
  const { currentUserAnnouncementsCount } = useGetCurrentUserAnnouncementsCount();

  const getCount = (type: keyof AnnouncementsCount) => {
    return currentUserAnnouncementsCount ? `(${currentUserAnnouncementsCount[type]})` : '';
  };

  return (
    <>
      <Header />
      <Container maxWidth='sm'>
        <Typography variant='h6' mb={2} textAlign='center' fontWeight='bold'>
          Moje ogłoszenia
        </Typography>

        <List sx={{ mt: 1 }} color='primary'>
          <NavigationLink status={'Active'} text={`Aktywne ${getCount('active')}`} />
          <NavigationLink status={'Pending'} text={`Oczekujące ${getCount('pending')}`} />
          <NavigationLink status={'Closed'} text={`Zakończone ${getCount('closed')}`} />
        </List>
        <Box textAlign='center' my={3}>
          <Button
            variant='outlined'
            sx={{ width: '100%' }}
            component={Link}
            to={AppRoutes.NewAnnouncement()}
          >
            Dodaj nowe ogłoszenie
          </Button>
        </Box>
      </Container>
    </>
  );
};

const NavigationLink = ({
  status,
  text,
}: {
  status: MyAnnouncementsListParams['status'];
  text: string;
}) => {
  const setAnnouncementsFilter = useSetAtom(announcementsFilterAtom);

  return (
    <ListItemButton
      component={Link}
      to={AppRoutes.MyAnnouncementsList({ status })}
      sx={{ pr: 0 }}
      onClick={() => setAnnouncementsFilter('')}
    >
      <ListItemText primary={text} />
      <ListItemIcon sx={{ minWidth: 'initial' }}>
        <Icon name='navigate_next' />
      </ListItemIcon>
    </ListItemButton>
  );
};

MyAnnouncements.displayName = 'MyAnnouncements';
