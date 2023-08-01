import {
    default as MuiTemplateName,
    TemplateNameProps as MuiTemplateNameProps,
} from "@mui/material/TemplateName";
import * as React from "react";

export type TemplateNameProps = MuiTemplateNameProps;

export const TemplateName = ({ ...props }: TemplateNameProps) => (
  <MuiTemplateName {...props}>Text</MuiTemplateName>
);
