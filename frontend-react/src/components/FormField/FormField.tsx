import { TextField } from 'src/ui-components';

// const StyledTextField = styled(TextField)({
//   '& .MuiInputBase-root': {
//     borderRadius: 6,
//   },
//   '& .MuiInputBase-input': {
//     paddingTop: 7,
//     paddingBottom: 7,
//   },
// }) as typeof TextField;

export type FormFieldProps = {
  label: string;
};
//   | {
//       isSelect: true;
//       children: ReactElement;
//     }
//   | { isSelect: false };

// export const TextField = <
//   Variant extends TextFieldVariants = TextFieldVariants
// >({
//   ...props
// }: MuiTextFieldProps<Variant> & TextFieldProps) => (
//   <MuiTextField {...props}></MuiTextField>
// );

export const FormField = ({ label }: FormFieldProps) => {
  return <TextField fullWidth variant='standard' label={label} helperText={' '}></TextField>;
};
