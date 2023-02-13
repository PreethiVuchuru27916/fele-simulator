const Ajv = require("ajv");
const ajv = new Ajv({ strict: false, allErrors: true });

const parseErrors = (validationErrors = [])=> {
  let errors = [];
  validationErrors.forEach(error => {
    errors.push({
      param: error.params["missingProperty"],
      key: error.keyword,
      message: error.message,
    });
  });
  return errors;
}

const validateJSON = (jsonSchema = {}, jsonData = {}) => {
  const validator = ajv.compile(jsonSchema);
  const isValid = validator(jsonData);
  if (!isValid) {
     const errors = parseErrors(validator.errors);
     throw errors;
  }
}

module.exports = {
  validateJSON
}