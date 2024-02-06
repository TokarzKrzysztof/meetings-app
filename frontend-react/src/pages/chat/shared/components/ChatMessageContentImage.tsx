import { CSSProperties, useState } from 'react';
import { Gallery } from 'src/components/Gallery';
import { Message } from 'src/models/chat/message';
import { useGetAllImageMessages } from 'src/queries/message-queries';
import { Box, CircularProgress, Skeleton } from 'src/ui-components';
import { SlideImage } from 'yet-another-react-lightbox';

export type ChatMessageContentImageProps = {
  maxHeight: number;
  message: Message;
  style?: CSSProperties;
  showPreviewOnClick?: boolean;
};

export const ChatMessageContentImage = ({
  maxHeight,
  message,
  style,
  showPreviewOnClick,
}: ChatMessageContentImageProps) => {
  const [show, setShow] = useState(false);
  const [galleryState, setGalleryState] = useState({
    open: false,
    index: 0,
    slides: [] as SlideImage[],
  });
  const { allImageMessages, allImageMessagesFetching, allImageMessagesRefetch } =
    useGetAllImageMessages(message.chatId, {
      enabled: false,
    });

  const handleOpenGallery = async () => {
    if (!showPreviewOnClick || allImageMessagesFetching) return;

    const images =
      allImageMessages !== undefined ? allImageMessages : (await allImageMessagesRefetch()).data!;
    setGalleryState({
      open: true,
      index: images.findIndex((x) => x.id === message.id),
      slides: images.map((x) => ({ src: x.value })),
    });
  };

  const handleCloseGallery = () => {
    setGalleryState((prev) => ({ ...prev, open: false }));
  };

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
      <Box position='relative' hidden={!show}>
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
          onClick={handleOpenGallery}
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
      <Gallery state={galleryState} onClose={handleCloseGallery} />
    </>
  );
};
