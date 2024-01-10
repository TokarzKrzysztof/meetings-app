export const parseIntoURLParams = (params: Record<string, unknown>) => {
  const result: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value instanceof Array) {
      result[key] = value.join(',');
    } else if (value === undefined || value === null) {
      result[key] = '';
    } else {
      result[key] = value + '';
    }
  });

  return result;
};
