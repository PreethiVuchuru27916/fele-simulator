const express = require('express')
const router = express.Router()

const { createNetworkHandler,
    loginUserHandler,
    createChannelHandler,
    deleteNetworkHandler,
    deleteOrganiationHandler,
    addOrganizationHandler,
    chainCodeDeployHandler } = require('../handlers/fele-client.handler')

router.get('/', async (req, res) => {
    res.send("Im FELE-CLIENT Base path")
})

router.post('/createNetwork', createNetworkHandler)
router.post('/createChannel', createChannelHandler)
router.delete('/deleteNetwork', deleteNetworkHandler)
router.post("/network/addOrg", addOrganizationHandler)
router.get("/network/deleteOrg/:orgName", deleteOrganiationHandler)
router.post('/chaincode/deploy', chainCodeDeployHandler)

module.exports = router