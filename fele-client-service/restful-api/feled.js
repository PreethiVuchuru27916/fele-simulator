const express = require('express')

const { couchdb, server } = require('../../../conf/feleConf.json')

const app = express()
const PORT = server.port

const { createNetwork } = require('../client-api/scripts/network')

app.get('/createNetwork', async(req, res) => {
    let networkCreated = await createNetwork(req.query.networkConfigJSON, req.query.networkName)
    if(networkCreated) res.send({"status" : "success"});
    else res.send({"status" : "error"})
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});

// Connectionless - restful api

