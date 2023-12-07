export const getFormData = (object: Record<string, unknown>) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value as string | Blob);
  });
  return formData;
};
