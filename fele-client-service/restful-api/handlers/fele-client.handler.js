const createNetwork = async(req, res) => {
    let networkCreated = await createNetwork(req.query.networkConfigJSON, req.query.networkName)
    if(networkCreated) res.send({"status" : "success"});
    else res.send({"status" : "error"})
}

const deleteNetwork = async (req, res) => {
    console.log({...req.query})
    let deleted = await deleteNetwork(req.query.networkName)
    if(deleted) res.send({"status": "Newtwork Deleted Successfully!"})
    else res.send({"status": "Error deleting network"})
}

module.exports = {
    createNetwork,
    deleteNetwork
}