import { useMemo, useRef, useState } from 'react';
import { Area } from 'react-easy-crop';
import { ImageCropDialogCropper } from 'src/components/ImageCropDialog/ImageCropDialogCropper/ImageCropDialogCropper';
import getCroppedImg from 'src/components/ImageCropDialog/crop-image';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
  Typography,
} from 'src/ui-components';

export type ImageCropDialogProps = {
  image: File;
  onAccept: (croppedImage: Blob) => void;
  onClose: () => void;
};

export const ImageCropDialog = ({
  image,
  onAccept,
  onClose,
}: ImageCropDialogProps) => {
  const [croppedImage, setCroppedImage] = useState<{
    file: Blob;
    src: string;
  } | null>(null);

  const sourceImageSrc = useMemo(() => URL.createObjectURL(image), [image]);
  const croppedAreaPixelsRef = useRef<Area>();
  // state here to not lose it when going on next step and back
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const generateCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        sourceImageSrc!,
        croppedAreaPixelsRef.current!
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Dialog
        open
        PaperProps={{
          sx: { m: 1, maxWidth: 'initial', maxHeight: 'calc(100% - 10px)' },
        }}
      >
        <Box textAlign='right'>
          <IconButton onClick={onClose}>
            <Icon name='close'></Icon>
          </IconButton>
        </Box>
        {!croppedImage ? (
          <>
            <DialogContent sx={{ p: 1 }}>
              <ImageCropDialogCropper
                imageSrc={sourceImageSrc}
                onCrop={(areaPixels) =>
                  (croppedAreaPixelsRef.current = areaPixels)
                }
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
              />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={onClose}>
                Anuluj
              </Button>
              <Button onClick={generateCroppedImage}>Dalej</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Box maxWidth={300} margin='0 auto'>
                <img
                  style={{ borderRadius: '50%', maxWidth: '100%' }}
                  src={croppedImage.src}
                />
              </Box>
              <Typography textAlign='center' my={2}>
                Czy chcesz ustawić to zdjęcie jako swoje nowe zdjęcie profilowe?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between' }}>
              <Button variant='outlined' onClick={() => setCroppedImage(null)}>
                Edytuj
              </Button>
              <Button onClick={() => onAccept(croppedImage.file)}>
                Zapisz
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
