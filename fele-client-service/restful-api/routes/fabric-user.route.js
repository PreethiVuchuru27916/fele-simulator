const express = require('express')
const router = express.Router()

const {loginFabricUserHandler,
    registerFabricUserHandler,
    updateFabricUserHandler,
    deleteFabricUserHandler
} = require('../handlers/fabric-user.handler')

router.post('/login', loginFabricUserHandler)
router.post('/register', registerFabricUserHandler)
router.post('/update', updateFabricUserHandler)
router.post('/delete', deleteFabricUserHandler)

module.exports = router