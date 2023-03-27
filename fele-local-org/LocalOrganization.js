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
        try{
            const {docs} = await getDocumentFromDatabase("fele__bid", {
                selector: {
                    organization: {
                        $eq: organization
                    }
                }
            })
            if(docs.length > 0) {
                res.status(500).send({
                    message: `FAILED!! Organization with name: '${organization}' exists.`
                })
                return
            } else {
                await insertToDatabase("fele__bid", organizationConfig)
            }
        } catch {
            await createDatabase("fele__bid")
            await insertToDatabase("fele__bid", organizationConfig)
        }

        res.send({
            ...req.body
        })
    } catch(error) {
        res.status(500).send({
            message: error
        })
    }

}

const addLocalUser = async (req, res) => {
    let {organization, user: {username, password, role}} = req.body
    password = sha256(password)

    try{

        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
    
        let localUsers = docs[0].localUsers || []
        let duplicateFound = false
        localUsers.forEach(user => {
            if(user.username === username) {
                duplicateFound = true
            }
        });
    
        if(duplicateFound) {
            res.status(500).send({
                message: `User ${username} already exists.`
            })
        } else {
            localUsers.push({username, password, role})
            docs[0].localUsers = localUsers
        
            const result = await updateDocument("fele__bid", docs[0])
        
            console.log(result)
            res.status(200).send({
                message: "local user added successfully"
            })
        }
    } catch(error) {
        res.status(500).send({
            message: "Internal error: "+error
        })
    }
    

}

const deleteLocalUser = async (req, res) => {
    let {organization, user: {username}} = req.body
    try{

        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
        let localUsers = docs[0].localUsers || []
        localUsers = localUsers.filter((user) => {
            return user.username !== username
        })

        console.log("local user users:  ", localUsers)
        docs[0].localUsers = localUsers
        const result = await updateDocument("fele__bid", docs[0])
        console.log(result)
            res.status(200).send({
                message: "local user deleted successfully"
            })
    
    } catch(error) {
        res.status(500).send({
            message: "Internal error: "+error
        })
    }
}
module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser
}