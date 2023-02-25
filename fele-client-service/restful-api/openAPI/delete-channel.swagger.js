const deleteChannelSwagger = {
    tags: ['Channel'],
    description: "Deletes a Channel",
    operationId: 'deleteChannel',
    parameters: [],
    requestBody: {
        content: {
            "application/json" : {
                schema: {
                    "$ref": "#/components/schemas/deleteChannelRequest"
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
                            "success": true,
                            "message": "Channel deleted successfully"
                        }
                }

            }
        }
    }
}
}

module.exports = {
    deleteChannelSwagger
}