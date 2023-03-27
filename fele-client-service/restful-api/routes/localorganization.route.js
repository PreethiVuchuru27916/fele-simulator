const express = require('express')
const router = express.Router()
const {createOrganization, addLocalUser, deleteLocalUser} = require('../../../fele-local-org/LocalOrganization')
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const { authenticateUser, authorize } = require('../middleware/auth')
const { isAdmin, isReader, isWriter} = require('../middleware/authorization')

router.post('/create', validateCreateOrganizationPayload, createOrganization)
router.post('/add-user', isAdmin, addLocalUser)
router.post('/delete-user', isAdmin, deleteLocalUser)

module.exports = router