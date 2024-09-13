const formatResponse = (statusCode, message, success, data = null) => {
  return {
    statusCode,
    message,
    success,
    data,
  };
};

module.exports = formatResponse;
