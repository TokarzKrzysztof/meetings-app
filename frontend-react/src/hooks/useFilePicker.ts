import { useState } from 'react';

export const useFilePicker = () => {
  const [file, setFile] = useState<File | null>(null);

  const showPicker = (accept?: 'image/*') => {
    return new Promise<File>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      if (accept) {
        input.accept = accept;
      }
      input.addEventListener('change', () => {
        const result = input.files![0];
        setFile(result);
        resolve(result);
      });

      input.click();
      input.remove();
    });
  };

  const clearFile = () => {
    setFile(null);
  };

  return { file, showPicker, clearFile };
};
