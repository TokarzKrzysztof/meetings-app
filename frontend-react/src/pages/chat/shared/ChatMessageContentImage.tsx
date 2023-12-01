import { CSSProperties, useState } from 'react';
import { Message } from 'src/models/chat/message';
import { Box, CircularProgress, Skeleton } from 'src/ui-components';

export type ChatMessageContentImageProps = {
  maxHeight: number;
  message: Message;
  style?: CSSProperties;
};

export const ChatMessageContentImage = ({
  maxHeight,
  message,
  style,
}: ChatMessageContentImageProps) => {
  const [show, setShow] = useState(false);

  const borderRadius = '16px';
  return (
    <>
      {!show && (
        <Skeleton
          variant='rectangular'
          sx={{ borderRadius, ...style }}
          width={200}
          height={maxHeight}
        />
      )}
      <Box position={'relative'} display={show ? 'block' : 'none'}>
        <img
          style={{
            opacity: message.isPending ? 0.5 : undefined,
            maxWidth: '100%',
            borderRadius,
            maxHeight,
            ...style,
          }}
          src={message.value}
          onLoad={() => setShow(true)}
        />
        {message.isPending && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress variant='determinate' value={message.progressPercentage} />
          </Box>
        )}
      </Box>
    </>
  );
};
