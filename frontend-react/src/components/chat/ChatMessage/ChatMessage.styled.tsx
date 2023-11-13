import { styled } from '@mui/material';
import { Box, Chip, Icon } from 'src/ui-components';
import { shouldNotForwardPropsWithKeys } from 'src/utils/types/should-not-forward-props';

type ReplyIconProps = { dystans: number; isAuthorCurrentUser: boolean };
export const StyledReplyIcon = styled(Icon, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<ReplyIconProps>([
    'dystans',
    'isAuthorCurrentUser',
  ]),
})<ReplyIconProps>(({ dystans, isAuthorCurrentUser }) => ({
  position: 'absolute',
  ...(isAuthorCurrentUser ? { right: -dystans } : { left: -dystans }),
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

type MessageProps = { variant: 'outlined' | 'filled' };
export const StyledMessage = styled(Box, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<MessageProps>(['variant']),
})<MessageProps>(({ theme, variant }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 4,
  ...(variant === 'filled'
    ? { background: theme.palette.grey[200] }
    : { background: 'white', border: `1px solid ${theme.palette.grey[400]}` }),
  '.MuiTypography-root': {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}));
