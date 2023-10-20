import Cropper, { Area, Point } from 'react-easy-crop';
import { Box, Slider } from 'src/ui-components';

export type ImageCropDialogCropperProps = {
  imageSrc: string;
  onCrop: (croppedAreaPixels: Area) => void;
  crop: Point;
  setCrop: (x: Point) => void;
  zoom: number;
  setZoom: (x: number) => void;
};

export const ImageCropDialogCropper = ({
  imageSrc,
  onCrop,
  crop,
  setCrop,
  zoom,
  setZoom,
}: ImageCropDialogCropperProps) => {
  return (
    <>
      <Box position={'relative'}>
        {/* image added for expand purpose */}
        <img
          src={imageSrc}
          style={{
            maxWidth: '100%',
            maxHeight: 700,
            visibility: 'hidden',
          }}
        />
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          zoomWithScroll
          showGrid={false}
          cropShape='round'
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={(_, croppedAreaPixels) => onCrop(croppedAreaPixels)}
          zoomSpeed={0.25}
          onZoomChange={(zoom) => setZoom(+zoom.toFixed(2))}
        />
      </Box>
      <Slider
        sx={{ width: '80%', margin: '0 auto', display: 'block' }}
        value={zoom}
        valueLabelDisplay='auto'
        onChange={(event, value) => setZoom(value as number)}
        step={0.01}
        min={1}
        max={3}
      />
    </>
  );
};
