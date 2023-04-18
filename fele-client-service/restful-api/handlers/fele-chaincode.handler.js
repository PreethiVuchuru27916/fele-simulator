const { invokeChaincode } = require('../../client-api/scripts/chaincode')

const invokeChaincodeHandlerGet = async (req, res) => {   
    console.log("get request params is "+JSON.stringify(req.query)) 
        
    const { network, channel, chaincodeName, chaincodeAction } = req.query;
    const chaincodeArgument = { "Args": [chaincodeAction] };

    try{
        const result = await invokeChaincode(network, channel, "user", chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }

}

const invokeChaincodeHandlerPost = async (req, res) => { 
    console.log("here")   
    const { network, channel, chaincodeName, chaincodeAction, data } = req.body;
    const chaincodeArgument = { "Args": [chaincodeAction, ...Object.values(data)] };
    
    try{
        const result = await invokeChaincode(network, channel, "user", chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const invokeChaincodeHandlerPut = async (req, res) => {    
    const { network, channel, chaincodeName, chaincodeAction, assetId, data } = req.query;
    console.log(data)
    const chaincodeArgument = { "Args": [ chaincodeAction, assetId, ...Object.values(data)] };
    
    try{
        const result = await invokeChaincode(network, channel, "user", chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const invokeChaincodeHandlerDelete = async (req, res) => {    
    const { network, channel, chaincodeName, chaincodeAction, assetId } = req.query;
    const chaincodeArgument = { "Args": [chaincodeAction, assetId] };
    
    try{
        const result = await invokeChaincode(network, channel, "user", chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

module.exports = {
    invokeChaincodeHandlerGet,
    invokeChaincodeHandlerPost,
    invokeChaincodeHandlerPut,
    invokeChaincodeHandlerDelete
}

//chaincode invoke -nn artemis -cn uhcl_international1 -ccn EmployeeAsset -ca {"Args":["createAsset","Sample","Developer","4000"]}
