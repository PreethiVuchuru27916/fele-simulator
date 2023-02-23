const {createNetworkSwagger} = require('./create-network.swagger')
const {createChannelSwagger} = require('./create-channel.swagger')
const { components } = require('./components.swagger')

exports.swaggerDocument = {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: '(FELE) Fabric Experimentation and Learning Environment',
        description: 'It is a learning environment for Blockchain which simulates Fabric Hyperledger',
        contact: {
            name: 'FELE Team',
            url: 'http://localhost:3000'
        },

    },
    servers: [
        {
            url: "http://localhost:8005",
            description: "Local Server"
        }
    ],
    tags: [
        {
            name: 'Fele Client',
            description: 'Client API - Interface to connect users to the blockchain network'
        },
        {
            name: 'Smart Contract',
            description: 'Smart contract routes API to execute contracts and transactions'
        }
    ],
    paths: {
        "/api/fele-client/createNetwork" : {
            "post": {
                ...createNetworkSwagger
           }    
        },
        "/api/fele-client/createChannel" : {
            "post": {
                ...createChannelSwagger
           }    
        }
    },
    components: {
        ...components
    }
}