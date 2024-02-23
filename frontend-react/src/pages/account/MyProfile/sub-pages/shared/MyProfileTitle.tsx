import { PageTitle } from 'src/components/PageTitle';

export type MyProfileTitleProps = {
  title: string;
};

export const MyProfileTitle = ({ title }: MyProfileTitleProps) => {
  return <PageTitle mb={4}>{title}</PageTitle>;
};
