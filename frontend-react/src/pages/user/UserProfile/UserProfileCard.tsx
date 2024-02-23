import { ReactNode } from 'react';
import { To } from 'react-router-dom';
import { Box, Button, Card, Icon, Typography } from 'src/ui-components';

export type UserProfileCardProps = {
  showEditButton: boolean;
  children: ReactNode;
  title?: string;
} & (
  | {
      onEdit: () => void;
      editLink?: never;
    }
  | { onEdit?: never; editLink: To }
);

export const UserProfileCard = ({
  showEditButton,
  children,
  title,
  onEdit,
  editLink,
}: UserProfileCardProps) => {
  return (
    <Card sx={{ pt: 2, pl: 2, pb: 1, pr: 1 }}>
      {title && (
        <Typography mb={2} color={'grey'}>
          {title}
        </Typography>
      )}
      {children}
      {showEditButton && (
        <Box mt={1} textAlign={'right'}>
          <Button
            size='small'
            variant='text'
            startIcon={<Icon name='edit'></Icon>}
            buttonOrLink={{
              isLink: !!editLink,
              to: editLink,
              onClick: onEdit,
            }}
          >
            Edytuj
          </Button>
        </Box>
      )}
    </Card>
  );
};
