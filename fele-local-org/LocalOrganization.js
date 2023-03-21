const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument} = require('../fele-client-service/utils/db')
const { sha256 } = require('../fele-client-service/utils/helpers')
const { v4: uuidv4 } = require('uuid')
const {ORG_ID_PREFIX} = require('../fele-client-service/utils/constants')

const createOrganization = async (req, res) => {
    let {organization, localUsers} = req.body

    localUsers.forEach(user => {
        user.password = sha256(user.password)
    });

    const timestamp = new Date().toISOString()
    organizationConfig = {
        _id: ORG_ID_PREFIX + uuidv4(),
        fmt: "Organization",
        created_at: timestamp,
        updated_at: timestamp,
        organization,
        localUsers
    }

    try{
        await createDatabase(organization)
        await insertToDatabase(organization, organizationConfig)
        res.send({
            ...req.body
        })
    } catch(error) {
        res.status(500).send({
            message: "Internal Error: "+ error
        })
    }

}

const addLocalUser = async (req, res) => {
    let {organization, user: {username, password, role}} = req.body
    password = sha256(password)

    try{

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
    
        localUsers.push({username, password, role})
        docs[0].localUsers = localUsers
    
        const result = await updateDocument(organization, docs[0])
    
        console.log(result)
        res.status(200).send({
            message: "local user added successfully"
        })
    } catch(error) {
        res.status(500).send({
            message: "Internal error: "+error
        })
    }
    

}

module.exports = {
    createOrganization,
    addLocalUser
}