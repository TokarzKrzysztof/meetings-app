import { styled } from '@mui/material';
import { useRef } from 'react';
import { ImageCropDialog } from 'src/components/ImageCropDialog/ImageCropDialog';
import { useFilePicker } from 'src/hooks/useFilePicker';
import { User } from 'src/models/user';
import { useGetCurrentUser, useUploadProfileImage } from 'src/queries/user-queries';
import { Avatar, Box, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';

const StyledEditButton = styled(IconButton)({
  position: 'absolute',
  bottom: 0,
  right: 0,
}) as typeof IconButton;

export type MyProfileImageProps = {
  currentUser: User;
};

export const MyProfileImage = ({ currentUser }: MyProfileImageProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
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
      <Box position={'relative'}>
        <Avatar src={currentUser.profileImage} size={150} />
        <StyledEditButton color='primary' filled ref={menuAnchorRef}>
          <Icon name='edit' />
        </StyledEditButton>
      </Box>
      <Menu
        anchorRef={menuAnchorRef}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => showPicker('image/*')}>
          {currentUser.profileImage ? 'Zmień' : 'Dodaj'} zdjęcie profilowe
        </MenuItem>
        <MenuItem>Wyświetl zdjęcie profilowe</MenuItem>
      </Menu>
      {file && (
        <ImageCropDialog image={file} onAccept={handleUploadProfileImage} onClose={clearFile} />
      )}
    </>
  );
};
