const createOrganizationSchema = require('../schemas/createOrganization.json')
const { validateJSON } = require('../../utils/schema-validator')
const logger = require('../../utils/logger')

const validateCreateOrganizationPayload = (req, res, next) => {
    const valResults = validateJSON(createOrganizationSchema, req.body)
    if(valResults.valid) {
        logger.info("Create organization payload validation success.")
        next()
    } else {
        res.status(400).send({
            ...valResults,
            message: "Request body doesnt comply with the schema"
        })
    }
}

module.exports = {
    validateCreateOrganizationPayload
}