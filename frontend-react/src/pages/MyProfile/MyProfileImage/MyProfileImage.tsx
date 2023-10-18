import { styled } from '@mui/material';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { Box, Icon, IconButton } from 'src/ui-components';

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
});

export type MyProfileImageProps = {};

export const MyProfileImage = ({ ...props }: MyProfileImageProps) => {
  return (
    <StyledImageWrapper>
      <img src={avatarPlaceholder} />
      <StyledEditButton color='primary' filled>
        <Icon name={'edit'} />
      </StyledEditButton>
    </StyledImageWrapper>
  );
};
