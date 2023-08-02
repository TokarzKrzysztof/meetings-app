import {
  default as MuiStack,
  StackProps as MuiStackProps,
  StackTypeMap,
} from '@mui/material/Stack';

export type StackProps = {};

export const Stack = <
  D extends React.ElementType = StackTypeMap['defaultComponent']
>({
  direction = 'row',
  ...props
}: MuiStackProps<D, { component?: D }> & StackProps) => (
  <MuiStack {...props}></MuiStack>
);
