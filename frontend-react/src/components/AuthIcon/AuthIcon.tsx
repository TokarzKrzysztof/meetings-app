import { Box, Icon } from 'src/ui-components';

export type AuthIconProps = {};

export const AuthIcon = ({ ...props }: AuthIconProps) => {
  return (
    <Box display={'flex'} sx={{ my: 3 }} justifyContent={'center'}>
      <Icon
        name={'account_circle'}
        color='primary'
        sx={{ fontSize: '5rem', my: 3, mx: 'auto' }}
      ></Icon>
    </Box>
  );
};
