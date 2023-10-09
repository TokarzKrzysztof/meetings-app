import {
  default as MuiCardActions,
  CardActionsProps as MuiCardActionsProps
} from '@mui/material/CardActions';

export type CardActionsProps = MuiCardActionsProps & {};

export const CardActions = ({ ...props }: CardActionsProps) => (
  <MuiCardActions {...props}></MuiCardActions>
);
