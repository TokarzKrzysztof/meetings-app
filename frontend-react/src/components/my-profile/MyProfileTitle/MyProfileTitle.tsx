import { Typography } from 'src/ui-components';

export type MyProfileTitleProps = {
  title: string;
};

export const MyProfileTitle = ({ title }: MyProfileTitleProps) => {
  return (
    <Typography
      variant='h5'
      sx={{ my: 8 }}
      textAlign='center'
      fontWeight='bold'
    >
      {title}
    </Typography>
  );
};
