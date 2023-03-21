const express = require('express')
const router = express.Router()
const {createOrganization, addLocalUser} = require('../../../fele-local-org/LocalOrganization')
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const { authenticateUser, authorize } = require('../middleware/auth')

router.post('/create', validateCreateOrganizationPayload, createOrganization)
router.post('/add-user', authorize, addLocalUser)

module.exports = router