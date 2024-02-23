import { PageTitle } from 'src/components/PageTitle';

export type MyChatsTitleProps = {
  title: string;
};

export const MyChatsTitle = ({ title }: MyChatsTitleProps) => {
  return <PageTitle mt={2}>{title}</PageTitle>;
};
