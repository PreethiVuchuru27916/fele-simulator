const { USER_WORKSPACE } = require('../../../globals')
const path = require('path')
const logger = require('../../utils/logger')
const { sha256 } = require('../../utils/helpers')
const { createOrganization, addLocalUser, deleteLocalUser, getAllLocalUsers, updatePassword, addCertToWallet, addNetworkToLocalOrgConfig, getCurrentUserMapping, getAllUserMappings, addNewMapping, deleteMapping, addChannelToNetwork, syncLocalOrg, listAllNetworksinLocalOrg, listAllChannelsInNetwork, listAllFeleUsersInChannel } = require('../../../fele-local-org/LocalOrganization')
const { isAdmin, isUser } = require('../../client-api/scripts/authorization')


const createOrganizationCLI = async(orgConfig) => {
    if (orgConfig.includes(".json")) {
        const filePath = path.join(USER_WORKSPACE, orgConfig)
        orgConfig = require(filePath)
      } else {
        orgConfig = JSON.parse(orgConfig)
      }
      try {
        let {organization, localUsers} = orgConfig
        await createOrganization(organization, localUsers)
        logger.info(`Organization ${organization} created successfully`)
      } catch (e) {
        logger.error(e)
      }
}

const addLocalUserCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, username, password, role, userdetails} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      await addLocalUser(organization, username, password, role, userdetails);
      logger.info(`User ${username} added successfully.`)
    }
    else{
      logger.error("Not an admin. Only admin can add a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const addNetworktoLocalOrgCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      await addNetworkToLocalOrgConfig(network, organization);
      logger.info(`Network ${network} added successfully.`)
    }
    else{
      logger.error("Not an admin. Only admin can add a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const addChannelToNetworkCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network, channel} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      await addChannelToNetwork(network, channel, organization);
      logger.info(`Channel ${channel} added successfully in the network ${network}.`)
    }
    else{
      logger.error("Not an admin. Only admin can add a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const syncLocalOrgCLI = async(username, password, organization) => {
  try{
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      await syncLocalOrg(organization);
      logger.info("Organization synchronized successfully.")
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const listAllNetworksinLocalOrgCLI = async(username, password, organization) => {
  try{
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      const result = await listAllNetworksinLocalOrg(organization);
      console.log(result)
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const listAllChannelsInNetworkCLI = async(username, password, organization, network) => {
  try{
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      const result = await listAllChannelsInNetwork(organization,network);
      console.log(result)
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const listAllFeleUsersInChannelCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network, channel} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      const result = await listAllFeleUsersInChannel(organization,network,channel);
      console.log(result)
    }
    else{
      logger.error("Not an admin. Only admin can list fele users.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const deleteLocalUserCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, username} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      await deleteLocalUser(organization, username);
      logger.info(`User ${username} deleted successfully.`);
    }
    else{
      logger.error("Not an admin. Only admin can delete a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const getAllLocalUsersCLI = async(adminUsername, adminPassword, organization) => {
  try{
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      const result = await getAllLocalUsers(organization);
      console.log(result)
    }
    else{
      logger.error("Not an admin. Only admin can delete a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const updatePasswordCLI = async(username, password, organization, newPassword) => {
  try{
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      password = sha256(password)
      newPassword = sha256(newPassword)
      await updatePassword(organization, username, password, newPassword);
      logger.info("Password updated successfully.")
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const addCertToWalletCLI = async(username, password, json) => {
  try{
    let {organization, feleUser, credentialId} = json
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      await addCertToWallet(feleUser, credentialId);
      logger.info(`Certificate added to Wallet Successfully.`)
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const getCurrentUserMappingCLI = async(username, password, json) => {
  try{
    let {organization, network, channel} = json
    var user = false
    user = await isUser(organization, username, password)
    if (user){
      const result = await getCurrentUserMapping(username, organization, network, channel);
      console.log(result)
    }
    else{
      logger.error("Username or Password Incorrect.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const getAllUserMappingsCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network, channel} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      const result = await getAllUserMappings(organization, network, channel);
      console.log(result)
    }
    else{
      logger.error("Not an admin. Only admin can delete a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const addNewMappingCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network, channel, feleUser, username} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      addNewMapping(organization, network, channel, username, feleUser);
      logger.info(`User ${username} mapped to Fele User ${feleUser} successfully.`);
    }
    else{
      logger.error("Not an admin. Only admin can map a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const deleteMappingCLI = async(adminUsername, adminPassword, json) => {
  try{
    let {organization, network, username, channel} = json
    var admin = false
    admin = await isAdmin(organization, adminUsername, adminPassword)
    if (admin){
      deleteMapping(organization, network, username, channel);
      logger.info(`Mapping deleted successfully.`);
    }
    else{
      logger.error("Not an admin. Only admin can map a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

module.exports = {
    createOrganizationCLI,
    addNetworktoLocalOrgCLI,
    addChannelToNetworkCLI,
    addLocalUserCLI,
    deleteLocalUserCLI,
    getAllLocalUsersCLI,
    updatePasswordCLI,
    addCertToWalletCLI,
    getCurrentUserMappingCLI,
    getAllUserMappingsCLI,
    addNewMappingCLI,
    deleteMappingCLI,
    syncLocalOrgCLI,
    listAllNetworksinLocalOrgCLI,
    listAllChannelsInNetworkCLI,
    listAllFeleUsersInChannelCLI
}