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
    let docs = await getDocs(organization)
    let localUsers = docs[0].localUsers || []
    console.log(localUsers)
    let duplicateFound = false
    const userObj = localUsers.findIndex((user => user.username == username))
    console.log(userObj)
    if(userObj == -1) {
        localUsers.push({username, password, role})
        docs[0].localUsers = localUsers
    
        await updateDocument(BID, docs[0])
    } else {
        throw new Error(`User ${username} already exists.`)
    }
    // localUsers.forEach(user => {
    //     if(user.username === username) {
    //         duplicateFound = true
    //         return
    //     }
    // });

    // if(duplicateFound) {
    //     throw new Error(`User ${username} already exists.`)
    // } else {
    //     localUsers.push({username, password, role})
    //     docs[0].localUsers = localUsers
    
    //     await updateDocument(BID, docs[0])
    // }
}

const deleteLocalUser = async (organization, username) => {
    const docs = await getDocs(organization)
    let localUsers = docs[0].localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(userObj == -1) {
        throw new Error("Local user not found")
    } else {
        localUsers = localUsers.filter((user) => {
            return user.username !== username
        })
    
        docs[0].localUsers = localUsers
        await updateDocument(BID, docs[0])
    }
}

const getAllLocalUsers = async (organization) => {
    const docs = await getDocs(organization)
    console.log(docs)
    return docs[0].localUsers || []
}

const getDocs = async (organization) => {
    const {docs} = await getDocumentFromDatabase(BID, {
        selector: {
            organization: {
                $eq: organization
            }
        }     
    })
    return docs
}

const updatePassword = async (organization, username, oldPassword, newPassword) => {
    let docs = await getDocs(organization)
    let localUsers = docs[0].localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(localUsers[userObj].password == oldPassword){
        localUsers[userObj].password = newPassword
        docs[0].localUsers = localUsers
        await updateDocument(BID, docs[0])
    } else {
        throw new Error("Password doesnt match with the record")
    }
}

module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser,
    getAllLocalUsers,
    updatePassword
}