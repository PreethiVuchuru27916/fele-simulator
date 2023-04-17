const localOrg = require('../LocalOrganization')
const logger = require('../../fele-client-service/utils/logger')

const registerLocalUser = (req, res) => {

}

const createOrganization = async (req, res) => {
    const {organization, localUsers} = req.body
    try {
        await localOrg.createOrganization(organization, localUsers)
        res.status(201).send({
            message: "Local organization created successfully"
        })
    } catch(error) {
        logger.error(error)
        res.status(500).send({
            message: error.message
        })
    }  
}

const addNetworkToLocalOrgConfig = async (req, res) => {
    const {networkName} = req.body
    const {organization} = req
    try {
        await localOrg.addNetworkToLocalOrgConfig(networkName, organization)
        res.status(200).send({
            message: "Network added to local organization configuration"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const addChannelToNetwork = async (req, res) => {
    const {network, channel} = req.headers
    const {organization} = req
    try {
        await localOrg.addChannelToNetwork(network, channel, organization)
        res.status(200).send({
            message: "Channel added in the network"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const addLocalUser = async (req, res) => {
    const {username, password, role, userDetails} = req.body
    const {organization} = req
    try{
        await localOrg.addLocalUser(organization, username, password, role, userDetails)
        res.status(200).send({
            message: `user ${username} added successfully`
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }

}

const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const {organization, username} = req
    try {
        await localOrg.updatePassword(organization, username, oldPassword, newPassword)
        res.status(200).send({
            message: "Password updated successfully!"
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}

const deleteLocalUser = async (req, res) => {
    const {username} = req.params
    const {organization, username: loggedUser} = req
    if(username == loggedUser) {
        res.status(500).send({
            message: "User(Admin) cannot delete himself"
        })
    } else{
        try{
            await localOrg.deleteLocalUser(organization, username)
            res.status(200).send({
                message: "user deleted successfully"
            })
        } catch(error) {
            logger.error(error)
            res.status(500).send({
                message: error.message
            })
        }   
    }
}

const getAllLocalUsers = async (req, res) => {
    try {
        const {organization} = req
        const localUsers = await localOrg.getAllLocalUsers(organization)
        res.status(200).send(localUsers)
    } catch(error) {
        logger.error(error)
        res.status(500).send({
            message: error
        })
    }
}

const addCertToWallet = async (req, res) => {
    const {feleUser, credentialId} = req.body
    try {
        await localOrg.addCertToWallet(feleUser, credentialId)
        res.status(200).send({
            feleUser,
            walletId: `wallet~${feleUser}`,
            message: "credential added to wallet"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const getAllUserMappings = async (req, res) => {
    const {organization} = req
    const {network, channel} = req.headers
    if(!network || !channel) {
        res.status(400).send({
            message: "Network and channel headers are required"
        })
        return
    }
    try {
        const mappings = await localOrg.getAllUserMappings(organization, network, channel)
        res.status(200).send(mappings)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const addNewMapping = async (req, res) => {
    const {organization} = req
    const {network, channel} = req.headers
    const {from, to} = req.body
    try {
        await localOrg.addNewMapping(organization, network, channel, from, to)
        res.status(200).send({
            message: "User mapped to "+to+" successfully"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const deleteMappping = async (req, res) => {
    const {organization, username} = req
    const {username: localUser} = req.query
    const {network, channel} = req.headers
    if(username == localUser) {
        res.status(500).send({
            message: "Admin (user) cannot delete his own mapping"
        })
        return
    }
    try{
        await localOrg.deleteMapping(organization, network, localUser, channel)
        res.status(200).send({
            message: "User mapped deleted"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const getCurrentUserMapping = async (req, res) => {
    const {organization, username} = req
    //const network =req.query.network
    const {network, channel} = req.headers
    if(!network) {
        res.status(400).send({
            message: "network query param is missing! "
        })
        return
    }
    try {
        const mapping = await localOrg.getCurrentUserMapping(username, organization, network, channel)
        res.status(200).send(mapping)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const listAllNetworks = async (req, res) => {
    const {organization} = req
    try {
        const nets = await localOrg.listAllNetworksinLocalOrg(organization)
        res.status(200).send(nets)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const listAllChannelsInNetwork = async (req, res) => {
    const {organization} = req
    const {network} = req.headers
    try {
        if(!network) throw new Error("Mandatory header 'network' is required")
        const channles = await localOrg.listAllChannelsInNetwork(organization, network)
        res.status(200).send(channles)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
    
}

const syncLocalOrg = async (req, res) => {
    const {organization} = req
    try {
        await localOrg.syncLocalOrg(organization)
        res.sendStatus(200)
    } catch(error) {
        res.status(500).send({message: error.message})
    }
}

const listAllFeleUsersInChannel = async (req, res) => {
    const {organization} = req
    const {network, channel} = req.headers
    try {
        if(!network || !channel) throw new Error("network and channel headers are required")
        const feleUsers = await localOrg.listAllFeleUsersInChannel(organization, network, channel)
        res.status(200).send(feleUsers)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    registerLocalUser,
    createOrganization,
    addLocalUser,
    updatePassword,
    deleteLocalUser,
    getAllLocalUsers,
    getAllUserMappings,
    addNewMapping,
    deleteMappping,
    getCurrentUserMapping,
    addCertToWallet,
    addNetworkToLocalOrgConfig,
    addChannelToNetwork,
    syncLocalOrg,
    listAllNetworks,
    listAllChannelsInNetwork,
    listAllFeleUsersInChannel
}