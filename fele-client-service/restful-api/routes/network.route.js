const express = require('express')
const router = express.Router()

const { createNetworkHandler, deleteNetworkHandler} = require('../handlers/fele-client.handler')

router.post('/create', createNetworkHandler)
router.delete('/delete', deleteNetworkHandler)

module.exports = router