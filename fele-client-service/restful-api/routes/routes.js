const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const channelRoutes = require('./channel.route')
const networkRoutes = require('./network.route')
const userRoutes = require('./user.route')
const localOrgRoutes = require('./localorganization.route')

module.exports = (app) => {
    app.use(cors())
    app.use(cookieParser())
    app.use(bodyParser.json())
    
    app.use('/api/channel', channelRoutes)
    app.use('/api/network', networkRoutes)
    app.use('/api/user', userRoutes)
    app.use('/api/localorganization', localOrgRoutes)
}