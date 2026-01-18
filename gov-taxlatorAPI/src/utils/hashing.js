const {hash, compare} = require('bcryptjs');

exports.doHash = async (value, saltValue) => {
  const result =  hash(value, saltValue);
  return result;
};

exports.doHashValidation =(value, hashedValue) => {
  const result = compare(value, hashedValue);
  return result;
}