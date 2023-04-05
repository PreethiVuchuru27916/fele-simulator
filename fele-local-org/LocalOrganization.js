const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument} = require('../fele-client-service/utils/db')
const { v4: uuidv4 } = require('uuid')
const {LORG_ID_PREFIX, LORG_FMT, BID} = require('../fele-client-service/utils/constants')
const logger = require('../fele-client-service/utils/logger')

const createOrganization = async (organization, localUsers) => {
    //expected to receive encrypted passwords(local users) from client side

    const timestamp = new Date().toISOString()
    const organizationConfig = {
        _id: LORG_ID_PREFIX + uuidv4(),
        fmt: LORG_FMT,
        created_at: timestamp,
        updated_at: timestamp,
        organization,
        localUsers
    }

    let docs
    try{
        ({docs} = await getDocumentFromDatabase(BID, {
            selector: {
                organization: {
                    $eq: organization
                }
            }
        }))
    } catch {
        await createDatabase(BID)
        await insertToDatabase(BID, organizationConfig)
        return;
    }

    if(docs.length > 0) {
        throw new Error(`FAILED!! Organization with name: '${organization}' exists.`)
    } else {
        await insertToDatabase(BID, organizationConfig)
    }

}

const addLocalUser = async (organization, username, password, role) => {
    let localUsers = await getAllLocalUsers()
    let duplicateFound = false
    localUsers.forEach(user => {
        if(user.username === username) {
            duplicateFound = true
        }
    });

    if(duplicateFound) {
        throw new Error(`User ${username} already exists.`)
    } else {
        localUsers.push({username, password, role})
        docs[0].localUsers = localUsers
    
        await updateDocument(BID, docs[0])
    }
}

const deleteLocalUser = async (organization, username) => {
    
    let localUsers = await getAllLocalUsers(organization)

    localUsers = localUsers.filter((user) => {
        return user.username !== username
    })

    docs[0].localUsers = localUsers
    await updateDocument(BID, docs[0])
}

const getAllLocalUsers = async (organization) => {
    const {docs} = await getDocumentFromDatabase(BID, {
        selector: {
            organization: {
                $eq: organization
            }
        }     
    })
    return docs[0].localUsers || []
}
module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser
}