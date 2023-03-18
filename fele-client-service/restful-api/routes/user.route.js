const express = require('express')
const router = express.Router()

const {loginUserHandler,
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/user.handler')
const { authenticateUser, isAuthrorized } = require('../middleware/auth')

router.post('/login', authenticateUser)
router.post('/update', isAuthrorized, updateUserHandler)
router.post('/delete', deleteUserHandler)

module.exports = router