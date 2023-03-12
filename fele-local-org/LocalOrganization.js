const {createDatabase, insertToDatabase} = require('../fele-client-service/utils/db')
const createOrganization = async (req, res) => {
    const {orgName, orgConfig} = req.body
    await createDatabase(orgName)
    await insertToDatabase(orgName, orgConfig)
    res.send({
        ...req.body
    })
}

module.exports = {
    createOrganization
}