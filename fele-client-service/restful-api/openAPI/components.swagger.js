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
    }
}

module.exports = {
    components
}