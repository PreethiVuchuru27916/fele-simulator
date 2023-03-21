const express = require('express')
const router = express.Router()

const {loginUserHandler,
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/user.handler')
const { authenticateUser, authorize } = require('../middleware/auth')

router.post('/:organization/login', authenticateUser)
router.post('/update', authorize, updateUserHandler)
router.post('/delete', deleteUserHandler)

module.exports = router