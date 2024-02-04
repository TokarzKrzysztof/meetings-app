import { styled } from '@mui/material';
import { useState } from 'react';
import { Message } from 'src/models/chat/message';
import { Box, CircularProgress, Icon, IconButton, Modal } from 'src/ui-components';

const StyledWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(1),
  top: theme.spacing(1),
})) as typeof IconButton;

export type ChatMessageContentImagePreviewProps = {
  message: Message;
  onClose: () => void;
};

export const ChatMessageContentImagePreview = ({
  message,
  onClose,
}: ChatMessageContentImagePreviewProps) => {
  const [show, setShow] = useState(false);

  return (
    <Modal open onClose={onClose} disableEventBubbling>
      <StyledWrapper>
        <StyledCloseButton onClick={onClose} filled size='small'>
          <Icon name='close'></Icon>
        </StyledCloseButton>
        {!show && (
          <Box>
            <CircularProgress />
          </Box>
        )}
        <img
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          hidden={!show}
          src={message.value}
          onLoad={() => setShow(true)}
        />
      </StyledWrapper>
    </Modal>
  );
};
