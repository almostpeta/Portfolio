export const catchAsync = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.log(e);
  }
};
