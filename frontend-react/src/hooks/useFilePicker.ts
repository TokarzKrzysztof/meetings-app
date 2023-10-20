import { useState } from 'react';

export const useFilePicker = () => {
  const [file, setFile] = useState<File | null>(null);

  const showPicker = (accept?: 'image/*') => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) {
      input.accept = accept;
    }
    input.addEventListener('change', () => {
      setFile(input.files![0]);
    });

    input.click();
    input.remove();
  };

  const clearFile = () => {
    setFile(null);
  };

  return { file, showPicker, clearFile };
};
