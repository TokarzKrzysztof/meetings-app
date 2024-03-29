import { default as MuiIcon, IconProps as MuiIconProps } from '@mui/material/Icon';

export type IconNames =
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
  | 'more_horiz'
  | 'key'
  | 'person_outline'
  | 'question_answer'
  | 'login'
  | 'tag_faces'
  | 'close'
  | 'tune'
  | 'edit'
  | 'group_add'
  | 'voice_over_off'
  | 'groups'
  | 'cloud_upload'
  | 'list'
  | 'archive'
  | 'campaign'
  | 'add'
  | 'person_off'
  | 'logout'
  | 'send'
  | 'reply'
  | 'message'
  | 'keyboard_double_arrow_down'
  | 'settings'
  | 'photo'
  | 'south';

export type IconProps = MuiIconProps<'span', { component?: 'span' }> & {
  name: IconNames;
};

export const Icon = ({ name, ...props }: IconProps) => <MuiIcon {...props}>{name}</MuiIcon>;

Icon.muiName = MuiIcon.muiName;
