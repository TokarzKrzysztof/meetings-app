import { styled } from '@mui/material';
import {
  IconButtonTypeMap,
  default as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@mui/material/IconButton';
import { ForwardedRef } from 'react';
import { typedForwardRef } from 'src/utils/types/forward-ref';
import { shouldNotForwardPropsWithKeys } from 'src/utils/types/should-not-forward-props';

const StyledMuiIconButton = styled(MuiIconButton, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<IconButtonProps>(['filled']),
})<IconButtonProps>(({ theme, filled }) => {
  if (filled)
    return {
      backgroundColor: theme.palette.primary.main,
      '.MuiIcon-root': {
        color: theme.palette.common.white,
      },
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    };
  return {};
});

export type IconButtonProps = {
  filled?: boolean;
};

export const IconButtonInner = <
  D extends React.ElementType = IconButtonTypeMap['defaultComponent'],
>(
  { filled, ...props }: MuiIconButtonProps<D, { component?: D }> & IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => <StyledMuiIconButton filled={filled} ref={ref} {...props}></StyledMuiIconButton>;

export const IconButton = typedForwardRef(IconButtonInner);
