import { useFilePicker } from 'src/hooks/useFilePicker';
import { Icon, IconButton } from 'src/ui-components';

export type ChatNewMessageImageProps = {
  onSend: (image: File) => void;
};

export const ChatNewMessageImage = ({ onSend }: ChatNewMessageImageProps) => {
  const { showPicker } = useFilePicker();

  const handleClick = () => {
    showPicker('image/*').then(onSend);
  };

  return (
    <IconButton onClick={handleClick}>
      <Icon name='photo' />
    </IconButton>
  );
};
