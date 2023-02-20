const express = require('express')
const router = express.Router()

const { createNetworkHandler,
    deleteNetworkHandler,
    removeOrganizationHandler,
    createChannelHandler,
    addOrganizationHandler,
    chainCodeDeployHandler } = require('../handlers/fele-client.handler')
const {validateCreateChannelPayload} = require('../validators/channelValidator')

router.get('/', async (req, res) => {
    res.send("Im FELE-CLIENT Base path")
})

router.post('/createNetwork', createNetworkHandler)
router.post('/createChannel', validateCreateChannelPayload, createChannelHandler)
router.delete('/deleteNetwork', deleteNetworkHandler) 
router.put("/network/addOrg", addOrganizationHandler) //TODO
router.put("/network/remove/:orgName", removeOrganizationHandler) //TODO
router.post('/chaincode/deploy', chainCodeDeployHandler) //TODO

module.exports = router