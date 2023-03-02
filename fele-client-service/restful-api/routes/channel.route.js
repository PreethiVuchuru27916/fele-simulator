const express = require('express')
const router = express.Router()

const {createChannelHandler, deleteChannelHandler} = require('../handlers/fele-client.handler')
const {validateCreateChannelPayload} = require('../validators/channelValidator')

//Channel Routes
router.post('/create', validateCreateChannelPayload, createChannelHandler)
router.delete('/delete', deleteChannelHandler)

module.exports = router