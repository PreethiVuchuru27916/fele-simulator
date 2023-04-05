const express = require('express')
const router = express.Router()

const {loginUserHandler,
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/user.handler')
const { authenticateUser } = require('../middleware/auth')

router.post('/:organization/login', authenticateUser)
router.post('/update', updateUserHandler)
router.post('/delete', deleteUserHandler)

module.exports = router