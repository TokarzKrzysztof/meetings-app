import { atom, useAtom } from 'jotai';
import { Message } from 'src/models/chat/message';
import { Box, Icon, IconButton, Stack, Typography } from 'src/ui-components';

export const replyMessageAtom = atom<Message | null>(null);

export type ChatReplyPreviewProps = {};

export const ChatReplyPreview = ({ ...props }: ChatReplyPreviewProps) => {
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);

  if (!replyMessage) return null;
  return (
    <Stack p={1} pb={0} alignItems={'center'} justifyContent={'space-between'}>
      <Box overflow={'hidden'}>
        <Typography>Odpowiadanie</Typography>
        <Typography
          color={'grey'}
          whiteSpace={'nowrap'}
          textOverflow={'ellipsis'}
          overflow={'hidden'}
        >
          {replyMessage.text}
        </Typography>
      </Box>
      <IconButton onClick={() => setReplyMessage(null)}>
        <Icon name='close' />
      </IconButton>
    </Stack>
  );
};
