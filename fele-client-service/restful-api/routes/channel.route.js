const express = require('express')
const router = express.Router()

const {createChannelHandler, deleteChannelHandler, addFeleUsersToChannel} = require('../handlers/fele-client.handler')
const {validateCreateChannelPayload} = require('../validators/channelValidator')
const {update} = require('../handlers/update.handler')

//Channel Routes
router.post('/create', validateCreateChannelPayload, createChannelHandler, update)
router.delete('/delete', deleteChannelHandler, update)
router.post('/add-fele-users', addFeleUsersToChannel, update)
module.exports = router