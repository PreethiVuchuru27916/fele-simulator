const { invokeChaincode } = require('../../client-api/scripts/chaincode')

const invokeChaincodeHandlerGet = async (req, res) => {   
    console.log("get request params is "+JSON.stringify(req.query)) 
        
    const { network, channel, chaincodeName, invokerName, chaincodeAction } = req.query;
    const chaincodeArgument = { "Args": [chaincodeAction] };
    
    try{
        const result = await invokeChaincode(network, channel, invokerName, chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const invokeChaincodeHandlerPost = async (req, res) => { 
    const { network, channel, chaincodeName, chaincodeAction, invokerName, data } = req.body;
    const chaincodeArgument = { "Args": [chaincodeAction, data] };
    
    try{
        const result = await invokeChaincode(network, channel, invokerName, chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const invokeChaincodeHandlerPut = async (req, res) => {    
    const { network, channel, chaincodeName, chaincodeAction, invokerName, assetId, data } = req.query;
    console.log(data)
    const chaincodeArgument = { "Args": [ chaincodeAction, assetId, data] };
    
    try{
        const result = await invokeChaincode(network, channel, invokerName, chaincodeName, chaincodeArgument)
        res.status(200).send(result)
    }catch(error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const invokeChaincodeHandlerDelete = async (req, res) => {    
    const { network, channel, chaincodeName, chaincodeAction, invokerName, assetId } = req.query;
    const chaincodeArgument = { "Args": [chaincodeAction, assetId] };
    
    try{
        const result = await invokeChaincode(network, channel, invokerName, chaincodeName, chaincodeArgument)
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

