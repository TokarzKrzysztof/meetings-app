import { styled } from '@mui/material';
import { Chip, Icon } from 'src/ui-components';
import { shouldNotForwardPropsWithKeys } from 'src/utils/types/should-not-forward-props';

type ReplyIconProps = { dystans: number };
export const StyledReplyIcon = styled(Icon, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<ReplyIconProps>(['dystans']),
})<ReplyIconProps>(({ dystans }) => ({
  position: 'absolute',
  right: -dystans,
  top: '50%',
  transform: 'translateY(-50%)',
}));

export const StyledMessageChip = styled(Chip)(({ theme }) => ({
  height: 'auto',
  display: 'block',
  padding: theme.spacing(1),
  '& .MuiChip-label': {
    padding: 0,
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
}));
