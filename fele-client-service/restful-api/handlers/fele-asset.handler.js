const { invokeChaincode } = require('../../client-api/scripts/chaincode')

const createAsset = async (req, res) => {
    
    const { network, channel, data } = req.body

    const chaincodeName = "EmployeeAsset"
    let argumentJSON = {
        "Args":["createAsset", ...Object.values(data)]
    }
    
    await invokeChaincode(network, channel, chaincodeName, argumentJSON)

    res.status(200).send({
        message: "good"
    })
}

const readAllAssets = async (req, res) => {
    console.log(req.body)
    res.status(200).send({
        message: "good"
    })
}

module.exports = {
    createAsset,
    readAllAssets
}

//chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["createAsset","Sample","Developer","4000"]}
