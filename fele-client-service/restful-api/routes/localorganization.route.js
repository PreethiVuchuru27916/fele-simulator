const express = require('express')
const router = express.Router()
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const Authorize = require('../middleware/LocalOrgAuthorization')
const Auth = require('../middleware/LocalOrgAuthentication')
const localOrg = require('../../../fele-local-org/handlers/localorganization.handler')

router.post('/login', Auth.Authenticate)
router.post('/create', validateCreateOrganizationPayload, localOrg.createOrganization)
router.post('/add-user', Authorize.Admin, localOrg.addLocalUser)
router.post('/delete-user', Authorize.Admin, localOrg.deleteLocalUser)
router.put('/user/update-password', Authorize.Any, localOrg.updateLocalUser) 
router.get('/get-all-users', localOrg.getAllLocalUsers) 
router.get('/mappings', Authorize.Admin, localOrg.getAllUserMappings) 
router.get('/mappings/current-user', localOrg.getCurrentUserMapping)
router.post('/mappings/add', Authorize.Admin, localOrg.addNewMapping)
router.delete('/mappings/delete', Authorize.Admin, localOrg.deleteMappping)

module.exports = router