import { PageTitle } from 'src/components/PageTitle';

export type SettingsTitleProps = {
  title: string;
};

export const SettingsTitle = ({ title }: SettingsTitleProps) => {
  return <PageTitle mb={4}>{title}</PageTitle>;
};
