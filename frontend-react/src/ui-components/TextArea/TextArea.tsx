import TextField, { TextFieldProps } from '@mui/material/TextField';
import { EmojiClickData } from 'emoji-picker-react';
import { ForwardedRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { EmojiPicker } from 'src/components/EmojiPicker/EmojiPicker';
import { InputAdornment } from 'src/ui-components';
import { typedForwardRef } from 'src/utils/types/forward-ref';

const insertAtIndex = (str: string, toInsert: string, index: number) => {
  return str.slice(0, index) + toInsert + str.slice(index);
};

export type TextAreaProps = Omit<
  TextFieldProps<'outlined'>,
  'variant' | 'ref' | 'multiline' | 'onChange'
> & {
  onChange: (value: string) => void;
  value: string;
};

const TextAreaInner = (
  { onChange, value, InputProps, size, ...props }: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const fieldRef = useRef<HTMLTextAreaElement>();
  const selectionStartRef = useRef<number>(0);

  const handleEmojiSelected = (emoji: EmojiClickData) => {
    if (!value) {
      onChange(emoji.emoji);
    } else {
      onChange(insertAtIndex(value, emoji.emoji, selectionStartRef.current));
    }
    selectionStartRef.current = selectionStartRef.current + emoji.emoji.length;
  };

  const { sx: inputPropsSx, ...RestInputProps } = InputProps ?? {};
  return (
    <TextField
      multiline
      inputRef={mergeRefs([fieldRef, ref])}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      size={size}
      InputProps={{
        sx: { pr: 0, ...inputPropsSx },
        endAdornment: (
          <InputAdornment
            position='end'
            sx={{ alignSelf: 'flex-start', marginTop: size === 'small' ? '11px' : '4px' }}
          >
            <EmojiPicker
              onEmojiSelected={handleEmojiSelected}
              onOpen={() => (selectionStartRef.current = fieldRef.current!.selectionStart)}
            />
          </InputAdornment>
        ),
        ...RestInputProps,
      }}
      {...props}
    />
  );
};

export const TextArea = typedForwardRef(TextAreaInner);
