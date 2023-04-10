const express = require('express')
const router = express.Router()
const {validateCreateOrganizationPayload} = require('../validators/localOrganizationValidator')
const Authorize = require('../middleware/LocalOrgAuthorization')
const Auth = require('../middleware/LocalOrgAuthentication')
const localOrg = require('../../../fele-local-org/handlers/localorganization.handler')

router.post('/login', Auth.Authenticate) //DONE VERIFIED
router.post('/create', validateCreateOrganizationPayload, localOrg.createOrganization) //DONE VERIFIED
router.post('/add-network', Authorize.Admin, localOrg.addNetworkToLocalOrgConfig)
router.post('/add-user', Authorize.Admin, localOrg.addLocalUser) //DONE VERIIFED
router.delete('/delete-user/:username', Authorize.Admin, localOrg.deleteLocalUser) //DONE VERIFIED
router.put('/user/update-password', Authorize.Any, localOrg.updatePassword) //DONE VERIFIED
router.get('/get-all-users', Authorize.Admin, localOrg.getAllLocalUsers)  //DONE VERIFIED
router.post('/wallet/add-cert', Authorize.Any, localOrg.addCertToWallet) //DONE VERIFIED
router.get('/mappings', Authorize.Admin, localOrg.getAllUserMappings) //DONE
router.get('/mappings/current-user', Authorize.Any, localOrg.getCurrentUserMapping) //DONE VERIFIED
router.post('/mappings/add', Authorize.Admin, localOrg.addNewMapping) //DONE VERIFIED
router.delete('/mappings/delete', Authorize.Admin, localOrg.deleteMappping) //DONE VERFIED
router.post('/add-feleuser', Authorize.Admin, localOrg.addFeleUserToLOrg)

module.exports = router