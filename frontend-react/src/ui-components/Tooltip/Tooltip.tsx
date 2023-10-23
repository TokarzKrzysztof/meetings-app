import { default as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

export type TooltipProps = {};

export const Tooltip = ({ ...props }: MuiTooltipProps & TooltipProps) => (
  <MuiTooltip {...props}></MuiTooltip>
);
