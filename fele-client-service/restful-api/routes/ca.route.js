const express = require('express')
const router = express.Router()
const {registerFeleUser, enrollFeleUser} = require('../handlers/fele-ca.handler')
//CA Routes
router.post('/register', registerFeleUser)
router.post('/enroll', enrollFeleUser)
module.exports = router