import {
  default as MuiTemplateName,
  TemplateNameProps as MuiTemplateNameProps,
  TemplateNameTypeMap,
} from '@mui/material/TemplateName';

export type TemplateNameProps<
  D extends React.ElementType = TemplateNameTypeMap['defaultComponent']
> = MuiTemplateNameProps<D, { component?: D }> & {};

export const TemplateName = <
  D extends React.ElementType = TemplateNameTypeMap['defaultComponent']
>({
  ...props
}: TemplateNameProps<D>) => (
  <MuiTemplateName {...props}></MuiTemplateName>
);
