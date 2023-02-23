const bodyParser = require('body-parser')
const cors = require('cors')

const channelRoutes = require('./channel.route')
const networkRoutes = require('./network.route')
const userRoutes = require('./user.route')

module.exports = (app) => {
    app.use(cors())
    app.use(bodyParser.json())
    
    app.use('/channel', channelRoutes)
    app.use('/network', networkRoutes)
    app.use('/user', userRoutes)
}