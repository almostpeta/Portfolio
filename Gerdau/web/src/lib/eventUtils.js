export const createEvent = (name, value, callback) => {
  const eventTarget = {
    name,
    value: value || undefined,
  };

  callback({ target: eventTarget });
};
