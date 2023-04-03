const httpResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify(body),
  };
};

const success = (statusCode, body) => {
  return httpResponse(statusCode, body);
};

const badRequest = () => {
  return httpResponse(400, 'Bad Request');
};

const notFound = (body) => {
  return httpResponse(404, body);
};

const serverError = () => {
  return httpResponse(500, 'Internal server error');
};

module.exports = {
  success,
  badRequest,
  notFound,
  serverError,
};
