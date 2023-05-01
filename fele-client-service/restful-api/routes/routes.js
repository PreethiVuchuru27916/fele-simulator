const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const channelRoutes = require('./channel.route')
const networkRoutes = require('./network.route')
const userRoutes = require('./user.route')
const localOrgRoutes = require('./localorganization.route')
const caRoutes = require('./ca.route')
const chaincodeRoutes = require('./chaincode.route')

module.exports = (app) => {
    app.use(cors())
    app.use(cookieParser())
    app.use(bodyParser.json())
    
    app.use('/api/fele/channel', channelRoutes)
    app.use('/api/fele/network', networkRoutes)
    app.use('/api/fele/user', userRoutes)
    app.use('/api/localorganization', localOrgRoutes)
    app.use('/api/fele/ca', caRoutes)
    app.use('/api/fele/chaincode', chaincodeRoutes)
}

