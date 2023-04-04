const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument} = require('../../utils/db')
const { sha256 } = require('../../utils/helpers')
const { v4: uuidv4 } = require('uuid')
const {ORG_ID_PREFIX} = require('../../utils/constants')
const logger = require('../../utils/logger')
var defaultLocalOrg = require('../../../conf/localOrg.json')

const createOrganization = async (organizationConfig) => {
    let {organization, localUsers} = organizationConfig

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
                return {
                    message: `FAILED!! Organization with name: ${organization} exists.`
                }
            } else {
                await insertToDatabase("fele__bid", organizationConfig)
                return {
                    message: `Organization with name: ${organization} created successfully.`
                }
            }
        } catch {
            await createDatabase("fele__bid")
            await insertToDatabase("fele__bid", organizationConfig)
            return {
                message: `Organization with name: ${organization} created successfully.`
            }
        }
    } catch(error) {
        logger.error(error)
    }

}

const addLocalUser = async (json) => {

    let {organization, user: {username, password, role}} = json
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
            return{
                message: `User ${username} already exists.`
            }
        } else {
            localUsers.push({username, password, role})
            docs[0].localUsers = localUsers
            await updateDocument("fele__bid", docs[0])
            return{
                message: "local user added successfully"
            }
        }
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

const deleteLocalUser = async (json) => {
    let {organization, user: {username}} = json
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
        if (docs[0].localUsers.length != localUsers.length){
            docs[0].localUsers = localUsers
            for(let i=0;i<docs[0].felenetworks.length;i++){
                let mappings = docs[0].felenetworks[i].mappings
                mappings = mappings.filter((user) => {
                    return user.from !== username
                })
                docs[0].felenetworks[i].mappings = mappings
            }
            await updateDocument("fele__bid", docs[0])
            return{
                message: "local user deleted successfully"
            }
        }
        else{
            return{
                message: `User ${username} does not exists.`
            }
        }
    
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

const mapLocalUser = async(json) => {
    let {organization, fele_network, fele_user, user: {username}} = json
    try{
        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
        let localUsers = docs[0].localUsers
        localUsers = localUsers.filter((user) => {
            return user.username == username
        })
        if (localUsers.length > 0){
            let index = -1
            for(let i=0;i<docs[0].felenetworks.length;i++){
                if (docs[0].felenetworks[i].felenetId == fele_network){
                    index=i;
                    break;
                }
            }
            if(index != -1){
                let f_network = docs[0].felenetworks[index]
                let u_index = -1
                let f_users = f_network.feleusers
                for(let i=0; i<f_users.length; i++){
                    if (f_users[i].feleuserId == fele_user){
                        u_index = i
                        break
                    }
                }
                if(u_index != -1){
                    let mappings = f_network.mappings
                    let m_index = -1
                    for(let i=0;i<mappings.length;i++){
                        if(mappings[i].from == username && mappings[i].to == fele_user){
                            m_index = i
                            break
                        }
                    }
                    if (m_index == -1){
                        mappings.push({"from":username,"to":fele_user})
                        f_network.mappings = mappings
                        docs[0].felenetworks[index] = f_network
                        await updateDocument("fele__bid", docs[0])
                        return{
                            message: `User ${username} mapped to Fele User ${fele_user} successfully.`
                        }
                    }
                    else{
                        return{
                            message: `User ${username} already mapped to Fele User ${fele_user}.`
                        }
                    }
                }
                else{
                    return{
                        message: `Fele user ${fele_user} does not exist.`
                    }
                }
            }
            else{
                return{
                    message: `Fele Network ${fele_network} does not exist.`
                }
            }
        }
        else{
            return{
                message: `User ${username} does not exist.`
            }
        }
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser,
    mapLocalUser
}