export const sanitizeEntries = (entries) => {
  const cleanValues = {};
  Object.keys(entries).forEach((key) => {
    cleanValues[key] = entries[key] || "";
  });

  return cleanValues;
};
