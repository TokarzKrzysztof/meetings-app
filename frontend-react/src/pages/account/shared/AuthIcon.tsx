import { Box, Icon, IconProps } from 'src/ui-components';

export type AuthIconProps = {
  iconName: IconProps['name'];
};

export const AuthIcon = ({ iconName }: AuthIconProps) => {
  return (
    <Box display='flex' sx={{ mb: 3 }} justifyContent='center'>
      <Icon name={iconName} color='primary' sx={{ fontSize: '5rem', my: 3, mx: 'auto' }}></Icon>
    </Box>
  );
};
