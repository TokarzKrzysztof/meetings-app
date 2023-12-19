import { Typography } from 'src/ui-components';

export type MyChatsTitleProps = {
  title: string;
};

export const MyChatsTitle = ({ title }: MyChatsTitleProps) => {
  return (
    <Typography pl={2} pt={2} pb={2} variant='h5' fontWeight={'bold'}>
      {title}
    </Typography>
  );
};
