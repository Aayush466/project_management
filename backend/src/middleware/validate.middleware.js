export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const allErrors = error.details.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res
      .status(400)
      .json({ message: "error validating data", error: allErrors });
  }
  next();
};
