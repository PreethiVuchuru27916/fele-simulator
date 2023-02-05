const express = require('express')
const router = express.Router()

const {createNetwork, deleteNetwork} = require('../handlers/fele-client.handler')

router.get('/', async (req, res) => {
    res.send("Im FELE-CLIENT Base path")
})

router.get('/createNetwork', createNetwork)
router.delete('/deleteNetwork', deleteNetwork)

module.exports = router