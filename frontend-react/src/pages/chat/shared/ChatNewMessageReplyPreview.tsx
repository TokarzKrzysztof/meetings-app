import { atom, useAtom } from 'jotai';
import { Message, MessageType } from 'src/models/chat/message';
import { ChatVoiceMessageDescription } from 'src/pages/chat/shared/ChatVoiceMessageDescription';
import { Box, Icon, IconButton, Stack, Typography } from 'src/ui-components';

export const replyMessageAtom = atom<Message | null>(null);

export type ChatNewMessageReplyPreviewProps = {};

export const ChatNewMessageReplyPreview = ({ ...props }: ChatNewMessageReplyPreviewProps) => {
  const [replyMessage, setReplyMessage] = useAtom(replyMessageAtom);

  if (!replyMessage) return null;
  return (
    <Stack p={1} pb={0} alignItems={'center'} justifyContent={'space-between'}>
      <Box overflow={'hidden'}>
        <Typography>Odpowiadanie</Typography>
        {replyMessage.type === MessageType.Image ? (
          <img style={{ maxHeight: 50 }} src={replyMessage.value} />
        ) : (
          <Typography
            color={'grey'}
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            overflow={'hidden'}
          >
            {replyMessage.type === MessageType.Audio ? (
              <ChatVoiceMessageDescription src={replyMessage.value} />
            ) : (
              replyMessage.value
            )}
          </Typography>
        )}
      </Box>
      <IconButton onClick={() => setReplyMessage(null)}>
        <Icon name='close' />
      </IconButton>
    </Stack>
  );
};
