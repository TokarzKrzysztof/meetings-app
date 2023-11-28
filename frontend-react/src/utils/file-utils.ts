export const isBlob = (value: unknown): value is Blob => {
  return value instanceof Blob;
};
