const express = require('express')
const router = express.Router()
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const Authorize = require('../middleware/LocalOrgAuthorization')
const Auth = require('../middleware/LocalOrgAuthentication')
const localOrg = require('../../../fele-local-org/handlers/localorganization.handler')

router.post('/login', Auth.Authenticate) //DONE VERIFIED
router.post('/create', validateCreateOrganizationPayload, localOrg.createOrganization) //DONE VERIFIED
router.post('/add-user', Authorize.Admin, localOrg.addLocalUser) //DONE VERIIFED
router.delete('/delete-user/:username', Authorize.Admin, localOrg.deleteLocalUser) //DONE VERIFIED
router.put('/user/update-password', Authorize.Any, localOrg.updatePassword) //DONE VERIFIED
router.get('/get-all-users', localOrg.getAllLocalUsers)  //DONE VERIFIED
router.get('/mappings', Authorize.Admin, localOrg.getAllUserMappings) 
router.get('/mappings/current-user', localOrg.getCurrentUserMapping)
router.post('/mappings/add', Authorize.Admin, localOrg.addNewMapping)
router.delete('/mappings/delete', Authorize.Admin, localOrg.deleteMappping)

module.exports = router