const ZSchema = require("z-schema");
const validator = new ZSchema();

// simple javascript function that returns a object based on validation of json schema
const validateSchema = async (jsonSchema = {}, jsonData = {}) => {
  try {
    const jsonIsValid = validator.validate(jsonData, jsonSchema); // This is used to validate the schema. Returns err object or valid object
    const errors = validator.getLastErrors();

    if (jsonIsValid) return { errors: false }; // return object that JSON data is valid
    if (errors && errors.length) return { errors: true, message: JSON.stringify(errors.map((error) => { return { "message": error.message }})) };  // return the object of errors
  } catch (error) {
    return { errors: true, message: error }
  }
}

module.exports = {
  validateSchema
}