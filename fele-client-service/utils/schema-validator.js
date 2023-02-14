// const jsonSchema = require("../../tmpworkspaceforuser/test-data/testSchema.json");
// const jsonData = require("../../tmpworkspaceforuser/test-data/testSchemaData.json");
const Ajv = require("ajv");
const ajv = new Ajv({ strict: false, allErrors: true });

const parseValidationErrors = (validationErrors = [])=> {
  let errors = [];
  validationErrors.forEach(error => {
    errors.push({
      param: JSON.stringify(error.params),
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
      const errors = parseValidationErrors(validator.errors);
      return { valid: isValid, errors };
  }
  return { valid: isValid };
}

// console.log(validateJSON(jsonSchema, jsonData));

module.exports = {
  validateJSON
}