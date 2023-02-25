const createNetworkSwagger = {
    tags: ['Network'],
    description: "Creates a network",
    operationId: 'createNetwork',
    parameters: [
        {
            name: "networkName",
            in: "query",
            description: "defines the name of the network",
            required: true,
            schema: {
                type: "string",
            }
        }
    ],
    requestBody: {
        content: {
            "application/json" : {
                schema: {
                    "$ref": "#/components/schemas/createNetworkRequest"
                }
            }
        }
    },
    responses: {
        "200": {          
            description: "200 Status OK (Request complete status)",
            "content": {
                "application/json": {
                    schema: {
                        type: "object", 
                        example: {
                            "status": "200 OK",
                            "nCreated": false,
                            "message": "Network Create Succesfully",
                            "networkConfig": {
                                "_id": "state.fele.felenet~root",
                                "fmt": "felenet",
                                "fmId": "root",
                                "includeLedger": false,
                                "transactionAware": false,
                                "blockAware": false,
                                "timestamping": false,
                                "walletUnaware": false
                            }
                        }
                    },
                }
            }
        }
    }


}

module.exports = {
    createNetworkSwagger
}