import { EmojiClickData } from 'emoji-picker-react';
import { useRef } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';
import { EmojiPicker } from 'src/components/EmojiPicker/EmojiPicker';
import { InputAdornment, TextField, TextFieldProps } from 'src/ui-components';
import { ControlledFieldProps } from 'src/utils/types/controlled-field-props';

const insertAtIndex = (str: string, toInsert: string, index: number) => {
  return str.slice(0, index) + toInsert + str.slice(index);
};

export type TextareaFieldProps = Omit<
  TextFieldProps<'outlined'>,
  'variant' | 'ref'
>;

export const TextareaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  controller: { field, fieldState },
  sx,
  InputProps,
  ...props
}: TextareaFieldProps & ControlledFieldProps<TFieldValues, TName>) => {
  const fieldRef = useRef<HTMLTextAreaElement>();

  const handleEmojiSelected = (emoji: EmojiClickData, event: MouseEvent) => {
    if (!field.value) {
      field.onChange(emoji.emoji);
    } else {
      field.onChange(
        insertAtIndex(
          field.value,
          emoji.emoji,
          fieldRef.current!.selectionStart
        )
      );
    }
  };

  return (
    <TextField
      fullWidth
      multiline
      label={label}
      inputRef={mergeRefs([fieldRef, field.ref])}
      name={field.name}
      error={!!fieldState.error}
      helperText={fieldState.error?.message ?? ' '}
      value={field.value ?? ''}
      onChange={(value) => field.onChange(value)}
      minRows={5}
      maxRows={10}
      sx={{ mt: 2, ...sx }}
      InputProps={{
        sx: { pr: 0 },
        endAdornment: (
          <InputAdornment
            position='end'
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            <EmojiPicker onEmojiSelected={handleEmojiSelected} />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      {...props}
    />
  );
};
