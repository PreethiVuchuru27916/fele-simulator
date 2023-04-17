const { createFeleOrg, deleteFeleOrg } = require('../../client-api/scripts/feleOrg')
const logger = require('../../utils/logger')

const createFeleOrgCLI = async(network, organization) => {
    try{
        createFeleOrg(network, organization)
    }catch(e){
        logger.error(e)
    }
    return
}

const deleteFeleOrgCLI = async(network, organization) => {
    try{
        deleteFeleOrg(network, organization)
    }catch(e){
        logger.error(e)
    }
    return
}

module.exports = {
    createFeleOrgCLI,
    deleteFeleOrgCLI
}