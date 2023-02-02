const express = require('express')
const { couchdb, server } = require('../../conf/feleConf')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const {swaggerDocument} = require('../../swagger')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = server.port

const feleClientRoutes = require('./routes/fele-client.route')
const scRoutes = require('./routes/sc.route')

app.use('/api/fele-client', feleClientRoutes)
app.use('/api/sc', scRoutes)

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});

// Connectionless - restful api

