/* eslint import/prefer-default-export: "off" */
// this is mock function, in production would be replaced by a real function
// I suppose only one implementation - that's why is this mock in src folder
export const read = (start, length, callback) => {
  if (length > 10) {
    throw new Error('Requested bytes stream is too long.'); // this would fail the test ;)
  }
  const response = [];
  for (let i = 0; i < length; i++) {
    response.push(`byte ${start + i}`);
  }
  // Note: in documentation is: "e.g. industrialProtocol.read(3, 1, callback) => callback(payload)"
  // But I believe, first argument should be an error (convention) - how could you signalize an error?
  return callback(null, response);
};
