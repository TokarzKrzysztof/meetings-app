import { styled } from '@mui/material';
import { useRef } from 'react';
import { ImageCropDialog } from 'src/components/ImageCropDialog/ImageCropDialog';
import { useFilePicker } from 'src/hooks/useFilePicker';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import {
  useGetCurrentUser,
  useUploadProfileImage,
} from 'src/queries/user-queries';
import { Box, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';

const StyledImageWrapper = styled(Box)({
  display: 'flex',
  height: 150,
  position: 'relative',
  img: {
    height: '100%',
    borderRadius: '50%',
  },
});

const StyledEditButton = styled(IconButton)({
  position: 'absolute',
  bottom: 0,
  right: 0,
}) as typeof IconButton;

export type MyProfileImageProps = {};

export const MyProfileImage = ({ ...props }: MyProfileImageProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const { file, showPicker, clearFile } = useFilePicker();
  const { uploadProfileImage } = useUploadProfileImage();
  const { currentUser, currentUserRefetch } = useGetCurrentUser();

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
      <StyledImageWrapper>
        <img src={currentUser?.profileImage ?? avatarPlaceholder} />
        <StyledEditButton color='primary' filled ref={menuAnchorRef}>
          <Icon name={'edit'} />
        </StyledEditButton>
      </StyledImageWrapper>
      <Menu
        anchorRef={menuAnchorRef}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => showPicker('image/*')}>
          {currentUser?.profileImage ? 'Zmień' : 'Dodaj'} zdjęcie profilowe
        </MenuItem>
        <MenuItem>Wyświetl zdjęcie profilowe</MenuItem>
      </Menu>
      {file && (
        <ImageCropDialog
          image={file}
          onAccept={handleUploadProfileImage}
          onClose={clearFile}
        />
      )}
    </>
  );
};
