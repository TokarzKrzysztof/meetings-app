import {
  IconTypeMap,
  default as MuiIcon,
  IconProps as MuiIconProps,
} from '@mui/material/Icon';

export type IconProps = {
  name:
    | 'menu'
    | 'star'
    | 'search'
    | 'arrow_forward'
    | 'account_circle'
    | 'arrow_back'
    | 'visibility'
    | 'visibility_off'
};

export const Icon = <
  D extends React.ElementType = IconTypeMap['defaultComponent']
>({
  name,
  ...props
}: MuiIconProps<D, { component?: D }> & IconProps) => (
  <MuiIcon {...props}>{name}</MuiIcon>
);

Icon.muiName = MuiIcon.muiName;
