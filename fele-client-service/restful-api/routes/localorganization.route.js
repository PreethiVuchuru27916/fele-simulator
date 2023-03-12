const express = require('express')
const router = express.Router()
const {createOrganization} = require('../../../fele-local-org/LocalOrganization')

router.post('/create', createOrganization)

module.exports = router