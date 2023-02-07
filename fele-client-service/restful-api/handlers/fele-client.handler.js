const { createNetwork } = require('../../client-api/scripts/network')

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


const createChannelHandler = (req, res) => {
    res.send("Create Channel Response")
}

const deleteNetworkHandler = async (req, res) => {
    console.log({...req.query})
    let deleted = await deleteNetwork(req.query.networkName)
    if(deleted) res.send({"status": "Newtwork Deleted Successfully!"})
    else res.send({"status": "Error deleting network"})
}

const addOrganizationHandler = (req, res) => {
    res.send("Add organization Response")
}


const deleteOrganiationHandler = (req, res) => {
    res.send("Delete Organization response")
}

const chainCodeDeployHandler = (req, res) => {
    res.send("Chain code deploy response")
}

module.exports = {
    createNetworkHandler,
    createChannelHandler,
    deleteNetworkHandler,
    addOrganizationHandler,
    deleteOrganiationHandler,
    chainCodeDeployHandler
}