import { GoBackBtn } from 'src/components/GoBackBtn';
import { Header } from 'src/components/header/Header';

export type MyProfileHeaderProps = {};

export const MyProfileHeader = ({ ...props }: MyProfileHeaderProps) => {
  return <Header leftSlot={<GoBackBtn />} />;
};
