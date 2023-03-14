const express = require('express')
const router = express.Router()
const {createOrganization, addLocalUser} = require('../../../fele-local-org/LocalOrganization')

router.post('/create', createOrganization)
router.post('/add-user', addLocalUser)

module.exports = router