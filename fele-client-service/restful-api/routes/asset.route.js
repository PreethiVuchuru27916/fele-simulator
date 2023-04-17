const express = require('express')
const router = express.Router()
const { createAsset, readAllAssets } = require('../handlers/fele-asset.handler')

//Asset Routes
router.post('/create-asset', createAsset)
router.get('/read-assets', readAllAssets) 

module.exports = router