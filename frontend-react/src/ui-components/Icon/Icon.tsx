import {
  IconTypeMap,
  default as MuiIcon,
  IconProps as MuiIconProps,
} from '@mui/material/Icon';

export type IconProps<
  D extends React.ElementType = IconTypeMap['defaultComponent']
> = MuiIconProps<D, { component?: D }> & {
  name:
    | 'menu'
    | 'star'
    | 'search'
    | 'arrow_forward'
    | 'account_circle'
    | 'arrow_back'
    | 'visibility'
    | 'visibility_off'
    | 'person'
    | 'person_add'
    | 'email'
    | 'check'
    | 'key'
    | 'person_outline'
    | 'question_answer'
    | 'tag_faces'
    | 'close'
    | 'edit';
};

export const Icon = <
  D extends React.ElementType = IconTypeMap['defaultComponent']
>({
  name,
  ...props
}: IconProps<D>) => <MuiIcon {...props}>{name}</MuiIcon>;

Icon.muiName = MuiIcon.muiName;
