import { Link } from 'react-router-dom';
import { Chat } from 'src/models/chat/chat';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Icon,
  IconButton,
  Typography,
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type GroupChatAloneInfoProps = {
  onClose: () => void;
  groupChat: Chat;
};

export const GroupChatAloneInfo = ({ onClose, groupChat }: GroupChatAloneInfoProps) => {
  return (
    <Dialog open onClose={onClose}>
      <Box textAlign='right'>
        <IconButton onClick={onClose}>
          <Icon name='close'></Icon>
        </IconButton>
      </Box>
      <DialogContent>
        <DialogContentText align='center'>
          <Typography>
            Jesteś aktualnie jedynym uczestnikiem tej rozmowy. Kliknij przycisk poniżej aby dodać
            innych użytkowników
          </Typography>
        </DialogContentText>
        <DialogContentText align='center' mt={4}>
          <Button component={Link} to={AppRoutes.NewGroupChat()} size='large'>
            Edytuj
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
