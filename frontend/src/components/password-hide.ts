export const hidePassword = (value: string): string => {
  return '*'.repeat(value.length);
};
