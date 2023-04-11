const { createNetwork, deleteNetwork } = require('../../client-api/scripts/network')
const { createChannel, deleteChannel } = require('../../client-api/scripts/channel')

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
    chainCodeDeployHandler
}