import { ReactNode } from 'react';
import { Link, To } from 'react-router-dom';
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
  const buttonProps = {
    size: 'small',
    variant: 'text',
    children: 'Edytuj',
    startIcon: <Icon name='edit'></Icon>,
  } as const;
  
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
          {onEdit ? (
            <Button onClick={onEdit} {...buttonProps} />
          ) : (
            <Button component={Link} to={editLink} {...buttonProps} />
          )}
        </Box>
      )}
    </Card>
  );
};
