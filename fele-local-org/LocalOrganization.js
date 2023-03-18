const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument} = require('../fele-client-service/utils/db')
const { sha256 } = require('../fele-client-service/utils/helpers')
const createOrganization = async (req, res) => {
    const {orgName, orgConfig} = req.body
    await createDatabase(orgName)
    await insertToDatabase(orgName, orgConfig)
    res.send({
        ...req.body
    })
}

const addLocalUser = async (req, res) => {
    let {organization, user: {username, password}} = req.body
    password = sha256(password)
    console.log({username, password})

    let {docs} = await getDocumentFromDatabase(organization, {
        selector: {
            organization: {
                $eq: organization
            }
        }     
    })

    let localUsers = docs[0].localUsers || []
    
    localUsers.forEach(user => {
        if(user.username === username) {
            res.status(500).send({
                message: `User ${username} already exists.`
            })
        }
    });

    localUsers.push({username, password})
    docs[0].localUsers = localUsers

    const result = await updateDocument(organization, docs[0])

    console.log(result)
    res.status(200).send(localUsers)

}

module.exports = {
    createOrganization,
    addLocalUser
}