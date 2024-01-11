import _ from "lodash";

export const isEqual = <T>(item1: T, item2: T, ignoreProperties: (keyof T)[] = []) => {
  const copy1 = { ...item1 };
  const copy2 = { ...item2 };

  ignoreProperties.forEach((key) => {
    delete copy1[key];
    delete copy2[key];
  });

  return _.isEqual(copy1, copy2);
};
