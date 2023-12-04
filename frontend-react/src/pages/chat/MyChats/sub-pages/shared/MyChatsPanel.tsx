import { ReactNode } from 'react';
import { List, Typography } from 'src/ui-components';

export type MyChatsPanelProps = {
  children: ReactNode[];
  noChatsText: ReactNode;
};

export const MyChatsPanel = ({ children, noChatsText }: MyChatsPanelProps) => {
  if (children.length) {
    return <List>{children}</List>;
  } else {
    return (
      <Typography mt={6} textAlign={'center'} color={'grey'}>
        {noChatsText}
      </Typography>
    );
  }
};
