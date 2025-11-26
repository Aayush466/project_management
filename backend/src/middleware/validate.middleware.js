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

export const validateBodyForm = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true }); // ✅ allowUnknown added

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

export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params,{ abortEarly: false });
   if (error) {
    const allErrors = error.details.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res
      .status(400)
      .json({ message: "error validating params", error: allErrors });
  }
  next();
};
