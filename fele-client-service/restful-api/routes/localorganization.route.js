const express = require('express')
const router = express.Router()
const {createOrganization, addLocalUser, deleteLocalUser} = require('../../../fele-local-org/LocalOrganization')
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const { authenticateUser, authorize } = require('../middleware/auth')
const { isAdmin, isReader, isWriter} = require('../middleware/authorization')

router.post('/login', authenticateUser)
router.post('/register', ) //TODO
// support for local-org : creates a new local organization 
router.post('/create', validateCreateOrganizationPayload, createOrganization)
// support for local-org : Adds a new local user to local organization 
router.post('/add-user', isAdmin, addLocalUser)
// support for local-org : Deletes an existing local user in local organization 
router.post('/delete-user', isAdmin, deleteLocalUser)
router.put('/update-user', authorize, updateUserHandler) //TODO

router.get('/get-all-users', ) //TODO
router.get('/mappings/') //TODO
router.get('/mappings/current-user')
router.post('/mappings/add')
router.delete('/mappings/delete')

module.exports = router