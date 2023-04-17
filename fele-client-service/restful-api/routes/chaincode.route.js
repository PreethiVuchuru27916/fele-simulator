const express = require('express')
const router = express.Router()
const { invokeChaincodeHandler } = require('../handlers/fele-chaincode.handler')

//Chaincode Routes
router.post('/invoke-chaincode', invokeChaincodeHandler)
// router.get('/read-chaincode', readAllAssets) 

module.exports = router
