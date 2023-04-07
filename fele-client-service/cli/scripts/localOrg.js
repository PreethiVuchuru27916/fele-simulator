const { USER_WORKSPACE } = require('../../../globals')
const path = require('path')
const logger = require('../../utils/logger')
const { createOrganization, addLocalUser, deleteLocalUser, mapLocalUser, deleteMapping } = require('../../client-api/scripts/localOrg')
const { isAdmin } = require('../../client-api/scripts/authorization')


const createOrganizationCLI = async(orgConfig) => {
    if (orgConfig.includes(".json")) {
        const filePath = path.join(USER_WORKSPACE, orgConfig)
        orgConfig = require(filePath)
      } else {
        orgConfig = JSON.parse(orgConfig)
      }
      try {
        const { message } = await createOrganization(orgConfig)
        logger.info(message)
      } catch (e) {
        logger.error(e)
      }
}

const addLocalUserCLI = async(adminUsername, adminPassword, json) => {
  try{
    const org = json["organization"]
    var admin = false
    admin = await isAdmin(org, adminUsername, adminPassword)
    if (admin){
      const { message } = await addLocalUser(json);
      console.log(message)
    }
    else{
      logger.error("Not an admin. Only admin can add a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const deleteLocalUserCLI = async(adminUsername, adminPassword, json) => {
  try{
    const org = json["organization"]
    var admin = false
    admin = await isAdmin(org, adminUsername, adminPassword)
    if (admin){
      const { message } = await deleteLocalUser(json);
      console.log(message);
    }
    else{
      logger.error("Not an admin. Only admin can delete a user.")
    }
  }
  catch(e){
    logger.error(e)
  }
}

const mapLocalUserCLI = async(adminUsername, adminPassword, json) => {
  try{
    const org = json["organization"]
    var admin = false
    admin = await isAdmin(org, adminUsername, adminPassword)
    if (admin){
      const { message } = await mapLocalUser(json);
      console.log(message);
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
    const org = json["organization"]
    var admin = false
    admin = await isAdmin(org, adminUsername, adminPassword)
    if (admin){
      const { message } = await deleteMapping(json);
      console.log(message);
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
    addLocalUserCLI,
    deleteLocalUserCLI,
    mapLocalUserCLI,
    deleteMappingCLI
}