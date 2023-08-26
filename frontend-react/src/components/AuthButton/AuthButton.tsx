import { PropsWithChildren } from 'react';
import { Box, Button } from 'src/ui-components';

export type AuthButtonProps = PropsWithChildren<{
  disabled: boolean;
}>;

export const AuthButton = ({ children, disabled }: AuthButtonProps) => {
  return (
    <Box display={'flex'} sx={{ my: 3 }} justifyContent={'center'}>
      <Button
        type='submit'
        size='large'
        sx={{ minWidth: 200 }}
        disabled={disabled}
      >
        {children}
      </Button>
    </Box>
  );
};
