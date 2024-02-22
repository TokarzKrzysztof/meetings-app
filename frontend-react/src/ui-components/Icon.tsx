import { default as MuiIcon, IconProps as MuiIconProps } from '@mui/material/Icon';

export type IconProps = MuiIconProps<'span', { component?: 'span' }> & {
  name:
    | 'menu'
    | 'star'
    | 'mic'
    | 'pause'
    | 'delete'
    | 'replay'
    | 'play_arrow'
    | 'search'
    | 'arrow_forward'
    | 'account_circle'
    | 'arrow_back'
    | 'visibility'
    | 'person_remove'
    | 'visibility_off'
    | 'photo_camera'
    | 'cake'
    | 'place'
    | 'more_vert'
    | 'male'
    | 'female'
    | 'navigate_before'
    | 'navigate_next'
    | 'arrow_back_ios'
    | 'arrow_forward_ios'
    | 'person'
    | 'person_add'
    | 'email'
    | 'check'
    | 'key'
    | 'person_outline'
    | 'question_answer'
    | 'tag_faces'
    | 'close'
    | 'edit'
    | 'cloud_upload'
    | 'add'
    | 'send'
    | 'reply'
    | 'keyboard_double_arrow_down'
    | 'photo'
    | 'south';
};

export const Icon = ({ name, ...props }: IconProps) => <MuiIcon {...props}>{name}</MuiIcon>;

Icon.muiName = MuiIcon.muiName;
