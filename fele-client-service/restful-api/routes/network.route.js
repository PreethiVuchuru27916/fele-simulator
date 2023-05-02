const express = require('express')
const router = express.Router()
const {update} = require('../handlers/update.handler')
const { createNetworkHandler, deleteNetworkHandler, createOrganizationHandler} = require('../handlers/fele-client.handler')

router.post('/create', createNetworkHandler, update)
router.delete('/delete', deleteNetworkHandler, update)
router.post('/organization/create', createOrganizationHandler)

module.exports = router