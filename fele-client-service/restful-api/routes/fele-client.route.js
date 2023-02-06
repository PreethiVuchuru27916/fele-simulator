const express = require('express')
const router = express.Router()

const {createNetworkHandler, deleteNetwork} = require('../handlers/fele-client.handler')

router.get('/', async (req, res) => {
    res.send("Im FELE-CLIENT Base path")
})

router.post('/createNetwork', createNetworkHandler)
router.delete('/deleteNetwork', deleteNetwork)


module.exports = router