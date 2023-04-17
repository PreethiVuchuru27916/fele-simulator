const { invokeChaincode } = require('../../client-api/scripts/chaincode')

const invokeChaincodeHandler = async (req, res) => {
    
    //console.log(req.body)
    const { network, channel, chaincodeName, chaincodeAction, data } = req.body
    
    const chaincodeArgument = {
        "Args":[chaincodeAction, ...Object.values(data)]
    }

    //console.log(chaincodeArgument)
    try{
        const assetId = await invokeChaincode(network, channel, chaincodeName, chaincodeArgument)
        console.log(assetId)
        res.status(200).send({
            message: "Transaction Successful",
            assetId
        })
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    invokeChaincodeHandler
}

//chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["createAsset","Sample","Developer","4000"]}
