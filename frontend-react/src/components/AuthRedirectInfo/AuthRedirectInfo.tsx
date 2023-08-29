import { PropsWithChildren } from 'react';
import { Box } from 'src/ui-components';

export const AuthRedirectInfo = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <Box
        mt={6}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexWrap={'wrap'}
        fontSize={13}
      >
        {children}
      </Box>
    </>
  );
};
