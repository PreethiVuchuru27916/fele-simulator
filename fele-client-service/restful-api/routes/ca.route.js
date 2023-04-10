const express = require('express')
const router = express.Router()
const {registerFeleUser, enrollFeleUser, getAllUserCredentialsForUser} = require('../handlers/fele-ca.handler')
//CA Routes
router.post('/user/register', registerFeleUser)
router.post('/user/enroll', enrollFeleUser) //Creates a certificate for fele-user
router.get('/user/get-credentials', getAllUserCredentialsForUser)
module.exports = router