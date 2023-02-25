const deleteNetworkSwagger = {
    tags: ['Network'],
    description: "Deletes a network",
    operationId: 'deleteNetwork',
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
    },
    responses: {
        "200": {          
            description: "200 Status OK (Request complete status)",
            "content": {
                "application/json": {
                    schema: {
                        type: "object", 
                        example: {
                            "message": "Network Delete Succesfully",
                        }
                    },
                }
            }
        }
    }


}

module.exports = {
    deleteNetworkSwagger
}