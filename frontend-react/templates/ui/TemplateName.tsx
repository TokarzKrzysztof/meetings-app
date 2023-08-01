import {
  default as MuiTemplateName,
  TemplateNameProps as MuiTemplateNameProps,
} from "@mui/material/TemplateName";

export type TemplateNameProps = MuiTemplateNameProps;

export const TemplateName = ({ ...props }: TemplateNameProps) => (
  <MuiTemplateName {...props}>Text</MuiTemplateName>
);
