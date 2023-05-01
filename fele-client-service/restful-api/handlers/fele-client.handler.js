const { createNetwork, deleteNetwork } = require('../../client-api/scripts/network')
const { createChannel, deleteChannel, addFeleUsersInChannel } = require('../../client-api/scripts/channel')
const {createFeleOrg} = require('../../client-api/scripts/feleOrg')
const createNetworkHandler = async (req, res) => {
    try {
        let {networkName} = req.query
        networkName = networkName.toLowerCase()
        const {networkConfig} = req.body
        const response = await createNetwork(networkConfig, networkName)
        res.status(201).send(response)
    } catch (e) {
        res.status(500).send({
            message: "Error creating network: "+e.message
        })
    }
}

const createChannelHandler = async (req, res) => {
    const { networkName, channelConfig } = req.body
    try {
        const response = await createChannel(networkName, channelConfig)
        res.status(201).send({
            ...response
        })
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
}

const createOrganizationHandler = async (req, res) => {
    const {network, organization} = req.headers
    if(!network || !organization) {
        res.status(400).send({message: "Network and organization headers are required"})
        return
    }
    try {
        await createFeleOrg(network, organization)
        res.status(200).send({
            message: "Organization created successfully"
        })
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const deleteChannelHandler = async (req, res) => {
    const { networkName, channelName } = req.body
    try {
        const response = await deleteChannel(networkName, channelName)
        res.status(200).send({
            ...response
        })
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
}

const addFeleUsersToChannel = async (req, res) => {
    const {network, channel, organization} = req.headers
    const {feleUsers} = req.body
    if(!network || !channel || !organization) {
        res.status(400).send({
            message: "network, channel and organization headers are required"
        })
        return
    }
    try {
        const response = await addFeleUsersInChannel(network, channel, organization, feleUsers)
        res.status(200).send(response)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const deleteNetworkHandler = async (req, res) => {
    const { networkName } = req.query
    try {
        await deleteNetwork(networkName)
        res.status(200).send({
            message: `Network ${networkName} Deleted Successfully!`
        })

    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
}

const addOrganizationHandler = (req, res) => {
    //TODO
    res.send("Add organization Response")
}


const removeOrganizationHandler = (req, res) => {
    //TODO
    res.send("Delete Organization response")
}

const chainCodeDeployHandler = (req, res) => {
    // TODO
    res.send("Chain code deploy response")
}

module.exports = {
    createNetworkHandler,
    createChannelHandler,
    deleteChannelHandler,
    deleteNetworkHandler,
    addOrganizationHandler,
    removeOrganizationHandler,
    chainCodeDeployHandler,
    createOrganizationHandler,
    addFeleUsersToChannel
}