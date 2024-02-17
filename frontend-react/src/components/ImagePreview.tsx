import { Gallery } from 'src/components/Gallery';

export type ImagePreviewProps = {
  src: string;
  onClose: () => void;
};

export const ImagePreview = ({ src, onClose }: ImagePreviewProps) => {
  return (
    <Gallery
      state={{ open: true, slides: [{ src }], index: 0 }}
      onClose={onClose}
      plugins={['Zoom']}
    ></Gallery>
  );
};
