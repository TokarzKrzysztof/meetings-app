export const replaceItem = <T extends { id: string }>(arr: T[], item: T) => {
  const oldItem = arr.find((x) => x.id === item.id)!;
  arr[arr.indexOf(oldItem)] = item;
};
