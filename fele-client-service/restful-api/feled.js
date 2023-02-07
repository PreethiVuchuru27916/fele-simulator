const express = require('express')
const { couchdb, server } = require('../../conf/feleConf')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const {swaggerDocument} = require('./openAPI/swagger')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = server.port

app.get('/api/', (req, res) => {
    console.log("Base path called")
    res.send("Hello, Im base path of api !!!!!")
})
const feleClientRoutes = require('./routes/fele-client.route')
const scRoutes = require('./routes/sc.route')
const fabricUserRoutes = require('./routes/fabric-user.route')
app.use('/api/fele-client', feleClientRoutes)
app.use('/api/sc', scRoutes)
app.use('/api/fabric-user', fabricUserRoutes)

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});

// Connectionless - restful api

