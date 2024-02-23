import { Box, BoxProps, CircularProgress } from 'src/ui-components';

export type LoaderProps = Omit<BoxProps<'div'>, 'ref'> & {};

export const Loader = ({ ...props }: LoaderProps) => {
  return (
    <Box textAlign={'center'} p={2} {...props}>
      <CircularProgress size={25} />
    </Box>
  );
};
