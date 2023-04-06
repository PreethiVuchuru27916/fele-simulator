const express = require('express')
const router = express.Router()

const {
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/user.handler')
const Auth = require('../middleware/LocalOrgAuthentication')

router.post('/:organization/login', Auth.Authenticate)
router.post('/update', updateUserHandler)
router.post('/delete', deleteUserHandler)

module.exports = router