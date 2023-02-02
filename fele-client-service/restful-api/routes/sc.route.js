const express = require('express')
const router = express.Router()

router.get('/', async(req, res) => {
    res.send('Im the SMART CONTRACT route')
});


module.exports = router