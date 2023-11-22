import { styled } from '@mui/material/styles';
import { atom, useAtom } from 'jotai';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { Box } from 'src/ui-components';

export const isTypingAtom = atom(false);

const StyledDotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignSelf: 'flex-start',
  padding: '10px 11px',
  border: '1px solid ' + theme.palette.grey[400],
  borderRadius: theme.shape.borderRadius * 4,
  marginBottom: theme.spacing(1),
}));

const StyledDot = styled('span')({
  '@keyframes mercuryTypingAnimation': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '28%': {
      transform: 'translateY(-5px)',
    },
    '44%': {
      transform: 'translateY(0px)',
    },
  },
  animation: 'mercuryTypingAnimation 1.5s infinite ease-in-out',
  borderRadius: 2,
  height: 4,
  width: 4,
  marginRight: 2,
  backgroundColor: '#90949c',
  '&:nth-of-type(1)': {
    animationDelay: '200ms',
  },
  '&:nth-of-type(2)': {
    animationDelay: '300ms',
  },
  '&:nth-of-type(3)': {
    animationDelay: '400ms',
  },
});

export type ChatTypingIndicatorProps = {};

export const ChatTypingIndicator = ({ ...props }: ChatTypingIndicatorProps) => {
  const [isTyping, setIsTyping] = useAtom(isTypingAtom);

  useSignalREffect('onGetNewMessage', () => {
    setIsTyping(false);
  });

  if (!isTyping) return null;
  return (
    <StyledDotsContainer>
      <StyledDot></StyledDot>
      <StyledDot></StyledDot>
      <StyledDot></StyledDot>
    </StyledDotsContainer>
  );
};
