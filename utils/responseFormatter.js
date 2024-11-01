// utils/responseFormatter.js

export const formatResponse = (
  res,
  data = null,
  status = 200,
  message = null
) => {
  return res.status(status).json({
    status: status,
    message: message || (status >= 200 && status < 300 ? "Success" : "Error"),
    data: data,
  });
};
