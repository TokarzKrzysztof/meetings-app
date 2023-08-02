import {
    default as MuiTemplateName,
    TemplateNameProps as MuiTemplateNameProps,
    TemplateNameTypeMap,
} from '@mui/material/TemplateName';

export type TemplateNameProps = {};

export const TemplateName = <
  D extends React.ElementType = TemplateNameTypeMap['defaultComponent']
>({
  ...props
}: MuiTemplateNameProps<D, { component?: D }> & TemplateNameProps) => (
  <MuiTemplateName {...props}></MuiTemplateName>
);

TemplateName.muiName = MuiTemplateName.muiName;
