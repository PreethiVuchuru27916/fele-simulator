const createChannelSchema = require('../schemas/createChannelSchema.json')
const { validateJSON } = require('../../utils/schema-validator')
const logger = require('../../utils/logger')

const validateCreateChannelPayload = (req, res, next) => {
    const valResults = validateJSON(createChannelSchema, req.body)
    if(valResults.valid) {
        logger.info("Create channel payload validation success.")
        next()
    } else {
        res.status(400).send({
            ...valResults,
            message: "Request body doesnt comply with the schema"
        })
    }
}

module.exports = {
    validateCreateChannelPayload
}