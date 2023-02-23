const createChannelSwagger = {
    tags: ['Fele Client'],
    description: "Creates a Channel",
    operationId: 'createChannel',
    parameters: [],
    requestBody: {
        content: {
            "application/json" : {
                schema: {
                    "$ref": "#/components/schemas/createChannelRequest"
                }
            }
        }
    },
    responses: {
        "201": {
            description: "201 Status OK (Request complete status)",
            "content": {
                "application/json": {
                    schema: {
                        type: "string",
                        example: {
                            "status": "201 OK",
                            "success": true,
                            "channelId": "channel-b940f537-40a3-4204-947d-c1ee09430ca5",
                            "channelName": "uhcl-international",
                            "message": "Channel created successfully"
                        }
                }

            }
        }
    }
}
}

module.exports = {
    createChannelSwagger
}