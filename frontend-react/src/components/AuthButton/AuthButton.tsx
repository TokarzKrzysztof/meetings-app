import { PropsWithChildren } from 'react';
import { Box, Button } from 'src/ui-components';

export const AuthButton = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box display={'flex'} sx={{ my: 3 }} justifyContent={'center'}>
      <Button type='submit' size='large' sx={{ minWidth: 200 }}>
        {children}
      </Button>
    </Box>
  );
};
