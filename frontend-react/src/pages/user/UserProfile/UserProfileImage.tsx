import { styled } from '@mui/material';
import { useRef, useState } from 'react';
import { ImagePreview } from 'src/components/ImagePreview';
import { ImageCropDialog } from 'src/components/image-crop-dialog/ImageCropDialog';
import { useFilePicker } from 'src/hooks/useFilePicker';
import { useGetCurrentUser, useUploadProfileImage } from 'src/queries/user-queries';
import { Avatar, Box, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';

const StyledEditButton = styled(IconButton)({
  position: 'absolute',
  bottom: 0,
  right: 0,
}) as typeof IconButton;

export type UserProfileImageProps = {
  imgSrc: string | null;
  isCurrentUser: boolean;
};

export const UserProfileImage = ({ imgSrc, isCurrentUser }: UserProfileImageProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const { file, showPicker, clearFile } = useFilePicker();
  const { uploadProfileImage } = useUploadProfileImage();
  const { currentUserRefetch } = useGetCurrentUser();

  const handleUploadProfileImage = (croppedImage: Blob) => {
    uploadProfileImage(croppedImage, {
      onSuccess: () => {
        currentUserRefetch();
        clearFile();
      },
    });
  };

  return (
    <>
      <Box
        position='relative'
        onClick={!isCurrentUser && imgSrc ? () => setShowImagePreview(true) : undefined}
      >
        <Avatar src={imgSrc} size={90} />
        {isCurrentUser && (
          <StyledEditButton color='primary' filled ref={menuAnchorRef}>
            <Icon name='photo_camera' />
          </StyledEditButton>
        )}
      </Box>
      <Menu
        anchorRef={menuAnchorRef}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => showPicker('image/*')}>
          {imgSrc ? 'Zmień' : 'Dodaj'} zdjęcie profilowe
        </MenuItem>
        {imgSrc && (
          <MenuItem onClick={() => setShowImagePreview(true)}>Wyświetl zdjęcie profilowe</MenuItem>
        )}
      </Menu>
      {file && (
        <ImageCropDialog image={file} onAccept={handleUploadProfileImage} onClose={clearFile} />
      )}
      {showImagePreview && (
        <ImagePreview src={imgSrc!} onClose={() => setShowImagePreview(false)} />
      )}
    </>
  );
};
