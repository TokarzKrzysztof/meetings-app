import { Box, Typography } from 'src/ui-components';

export type PrivateChatDeletedParticipantInfoProps = {};

export const PrivateChatDeletedParticipantInfo = ({
  ...props
}: PrivateChatDeletedParticipantInfoProps) => {
  return (
    <Box p={1} sx={(theme) => ({ background: theme.palette.grey[100] })}>
      <Typography fontSize={14} textAlign={'center'}>
        Użytkownik usunął konto, nie możesz wysyłać do niego wiadomości
      </Typography>
    </Box>
  );
};
