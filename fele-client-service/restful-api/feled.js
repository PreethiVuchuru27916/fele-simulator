const express = require('express')
const { couchdb, server } = require('../../conf/feleConf')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../../swagger.json')
const { createNetwork, deleteNetwork } = require('../client-api/scripts/network')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = server.port

app.get('/createNetwork', async(req, res) => {
    let networkCreated = await createNetwork(req.query.networkConfigJSON, req.query.networkName)
    if(networkCreated) res.send({"status" : "success"});
    else res.send({"status" : "error"})
});

app.delete('/deleteNetwork', async (req, res) => {
    console.log({...req.query})
    let deleted = await deleteNetwork(req.query.networkName)
    if(deleted) res.send({"status": "Newtwork Deleted Successfully!"})
    else res.send({"status": "Error deleting network"})
})

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});

// Connectionless - restful api

