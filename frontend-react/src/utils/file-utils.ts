export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result as string);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  });
};

export const isFile = (value: unknown): value is File => {
  return value instanceof File;
};
