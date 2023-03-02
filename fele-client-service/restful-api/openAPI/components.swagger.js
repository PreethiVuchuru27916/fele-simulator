const components = {
    schemas: {
        createNetworkRequest: {
            type: "object",
            properties: {
                "_id": {
                    type: "string",
                    example: "state.fele.felenet~root"
                },
                "fmt": {
                    type: "string",
                    example: "felenet",
                },
                "fmId": {
                    type: "string",
                    example: "root",
                },
                "includeLedger": {
                    type: "boolean",
                    example: false
                },
                "transactionAware": {
                    type: "boolean",
                    example: false
                },
                "blockAware": {
                    type: "boolean",
                    example: false
                },
                "timestamping": {
                    type: "boolean",
                    example: false
                },
                "walletUnaware": {
                    type: "boolean",
                    example: false
                }
            }
        },
        createChannelRequest: {
            type: "object",
            properties: {
                "networkName": {
                  type: "string",
                  example: "artemis"
                },
                "channelConfig": {
                    type: "object",
                    properties:{
                        "channelName":{
                            type:"string",
                            example: "uhcl-international"
                        },
                        "organizations":{
                            type:"array",
                            items: {
                                type: "object",
                                properties:{
                                    "mspid":{
                                        type:"string",
                                        example: "uhclMSP"
                                    },
                                    "root_ca":{
                                        type: "string",
                                        example: "walletID234"
                                    }
                                }
                            }
                        },
                        "mod_policy":{
                            type: "string",
                            example: "Admins"
                        },
                        "policies":{
                            type: "array",
                            items:{
                                type: "object",
                                properties: {
                                    "name":{
                                        type: "string",
                                        example: "Readers"
                                    },
                                    "type":{
                                        type: "string",
                                        example: "ImplicitMeta"
                                    },
                                    "rule":{
                                        type: "string",
                                        example: "ANY Readers"
                                    }
                                }
                            }
                        }
                    }
                }
            }

        },
        deleteChannelRequest: {
            type: "object",
            properties: {
                "networkName": {
                    type: "string",
                    example: "artemis"
                  },
                  "channelName": {
                    type: "string",
                    example: "uhcl"
                  }
            }
        }

    }
}

module.exports = {
    components
}