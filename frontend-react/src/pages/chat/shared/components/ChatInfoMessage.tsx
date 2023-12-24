import { Message } from 'src/models/chat/message';
import { Typography } from 'src/ui-components';

export type ChatInfoMessageProps = {
  message: Message;
};

export const ChatInfoMessage = ({ message }: ChatInfoMessageProps) => {
  return <Typography align='center' fontSize={13} color={'grey'}>{message.value}</Typography>;
};
