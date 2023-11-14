import { styled } from '@mui/material';
import { Box, Icon } from 'src/ui-components';
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

type MessageProps = { variant: 'outlined' | 'filled'; shrinkMessage?: boolean };
export const StyledMessage = styled(Box, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<MessageProps>(['variant', 'shrinkMessage']),
})<MessageProps>(({ theme, variant, shrinkMessage }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 4,
  ...(variant === 'filled'
    ? { background: theme.palette.grey[200] }
    : { background: 'white', border: `1px solid ${theme.palette.grey[400]}` }),
  '.MuiTypography-root': {
    ...(shrinkMessage && {
      wordBreak: 'break-word',
      display: '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }),
    whiteSpace: 'pre-wrap',
  },
}));
