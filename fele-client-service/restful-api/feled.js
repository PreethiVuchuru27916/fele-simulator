const express = require('express')
const { server } = require('../../conf/feleConf')
const swaggerUi = require('swagger-ui-express')
const {swaggerDocument} = require('./openAPI/swagger')

const app = express()

//Adding Routes
require('./routes/routes')(app)

//openAPI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.get('/', (req, res) => {
    console.log("Base path called")
    res.send("Hello, Im base path of api !!!!!")
})

const PORT = server.port
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});