const createChannelSwagger = {
    tags: ['Fele Client'],
    description: "Creates a channel in the specified network",
    operationId: 'createChannel',
    responses: {
        "200": {          
            description: "200 OK (Channel created successfully)",
            "content": {
                "application/json": {
                    schema: {
                        type: "object", 
                        example: {
                            status: 200,
                            message: 'Channel created successfully'
                        }
                    },
                }
            }
        }
    }
}

module.exports = {
    createChannelSwagger
}