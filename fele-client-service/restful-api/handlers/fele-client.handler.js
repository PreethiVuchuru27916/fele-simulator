const { createNetwork, deleteNetwork } = require('../../client-api/scripts/network')
const { createChannel } = require('../../client-api/scripts/channel')

const createNetworkHandler = async(req, res) => {
    const networkName = req.query.networkName
    await createNetwork(JSON.stringify(req.body), networkName)
    res.send(
        {
            status: "200 OK", 
            nCreated: true,
            message: "Network Create Syccesfully", 
            networkConfig: {...req.body}
        }
    )
}
 

const createChannelHandler = async (req, res) => {
    const {networkName, channelName} = req.body

    const channelId = await createChannel(networkName, channelName, req.body.channelConfig)
    if(channelId) {
        res.status(201).send({
            status: "Created",
            message: "Channel created successfully",
            channelId

        })
    } else {
        res.status(500).send({
            status: "error",
            message: "Error creating channel"
        })
    }
}

const deleteNetworkHandler = async (req, res) => {
    console.log({...req.query})
    let deleted = await deleteNetwork(req.query.networkName)
    if(deleted) res.send({"status": "Newtwork Deleted Successfully!"})
    else res.send({"status": "Error deleting network"})
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
    deleteNetworkHandler,
    addOrganizationHandler,
    removeOrganizationHandler,
    chainCodeDeployHandler
}