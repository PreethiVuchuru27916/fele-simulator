const express = require('express')
const router = express.Router()

const { createNetworkHandler, deleteNetworkHandler, createOrganizationHandler} = require('../handlers/fele-client.handler')

router.post('/create', createNetworkHandler)
router.delete('/delete', deleteNetworkHandler)
router.post('/organization/create', createOrganizationHandler)

module.exports = router