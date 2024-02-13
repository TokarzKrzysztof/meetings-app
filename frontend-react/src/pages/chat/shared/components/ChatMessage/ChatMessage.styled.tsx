import { CSSObject, styled } from '@mui/material';
import { theme } from 'src/config/theme-config';
import { MessageType } from 'src/models/chat/message';
import { Box, Icon } from 'src/ui-components';
import { limitLinesVertical } from 'src/utils/style-utils';
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

export const messageStyles = {
  border: `1px solid ${theme.palette.grey[400]}`,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 4,
} as const;

type MessageProps = {
  variant: 'outlined' | 'filled';
  type: MessageType;
  isRepliedMessage?: boolean;
};
export const StyledMessage = styled(Box, {
  shouldForwardProp: shouldNotForwardPropsWithKeys<MessageProps>([
    'variant',
    'type',
    'isRepliedMessage',
  ]),
})<MessageProps>(({ theme, variant, type, isRepliedMessage }) => {
  const result: CSSObject = {
    padding: messageStyles.padding,
    borderRadius: messageStyles.borderRadius,
    ...(variant === 'filled'
      ? { background: theme.palette.grey[200] }
      : { background: 'white', border: messageStyles.border }),
    '.MuiTypography-root': {
      ...(isRepliedMessage && limitLinesVertical(4)),
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  };

  const condition = isRepliedMessage ? type === MessageType.Image : type !== MessageType.Text;
  if (condition) {
    result.padding = undefined;
    result.background = undefined;
    result.border = undefined;
    result.lineHeight = 0;
  }
  if (isRepliedMessage && type !== MessageType.Image) {
    result.paddingBottom = theme.spacing(2);
  }

  return result;
});
