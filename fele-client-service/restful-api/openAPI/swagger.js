const {createNetworkSwagger} = require('./create-network.swagger')
const {createChannelSwagger} = require('./create-channel.swagger')
const {deleteChannelSwagger} = require('./delete-channel.swagger')
const {deleteNetworkSwagger} = require('./delete-network.swagger')
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
            name: 'Network',
            description: 'Network Endpoints'
        },
        {
            name: 'Channel',
            description: 'Channel Endpoints'
        }
    ],
    paths: {
        "/network/create" : {
            "post": {
                ...createNetworkSwagger
           }    
        },
        "/channel/create" : {
            "post": {
                ...createChannelSwagger
           }    
        },
        "/channel/delete" : {
            "delete": {
                ...deleteChannelSwagger
           }    
        },
        "/network/delete" : {
            "delete": {
                ...deleteNetworkSwagger
           }    
        }
    },
    components: {
        ...components
    }
}