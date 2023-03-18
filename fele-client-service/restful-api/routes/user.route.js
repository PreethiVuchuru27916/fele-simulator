const express = require('express')
const router = express.Router()

const {loginUserHandler,
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/fabric-user.handler')

router.post('/login', loginUserHandler)
router.post('/update', updateUserHandler)
router.post('/delete', deleteUserHandler)

module.exports = router