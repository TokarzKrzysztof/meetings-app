import { Typography, TypographyProps } from 'src/ui-components';

export type PageTitleProps = TypographyProps<'h6'> & {};

export const PageTitle = ({ ...props }: PageTitleProps) => {
  return <Typography variant='h6' mb={2} textAlign='center' fontWeight='bold' {...props} />;
};
