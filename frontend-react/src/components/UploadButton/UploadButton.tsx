import { styled } from '@mui/material';
import { ChangeEvent, PropsWithChildren } from 'react';
import { Button, Icon } from 'src/ui-components';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export type UploadButtonProps = PropsWithChildren<{
  accept?: 'image/*';
  onUpload: (file: File) => void;
}>;

export const UploadButton = ({
  children,
  onUpload,
  accept,
}: UploadButtonProps) => {
  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <Button component='label' startIcon={<Icon name='cloud_upload' />}>
      {children}
      <VisuallyHiddenInput
        type='file'
        onChange={onFileInputChange}
        accept={accept}
      />
    </Button>
  );
};
