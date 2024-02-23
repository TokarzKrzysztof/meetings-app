import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';

export type SettingsHeaderProps = {};

export const SettingsHeader = ({ ...props }: SettingsHeaderProps) => {
  return <Header leftSlot={<GoBackBtn />} />;
};
