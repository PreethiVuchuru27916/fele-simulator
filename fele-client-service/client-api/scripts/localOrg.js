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
    try{
        let {organization, user: {username, password, role}} = json
        password = sha256(password)
        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
        if(docs.length>0){
            let localUsers = docs[0].localUsers || []
            const userObj = localUsers.findIndex((user => user.username == username))
            if(userObj == -1) {
                localUsers.push({username, password, role})
                docs[0].localUsers = localUsers
                await updateDocument("fele__bid", docs[0])
                return{
                    message: `User ${username} added successfully.`
                }
            } else {
                return{
                    message: `User ${username} already added.`
                }
            }
        }else{
            return{
                message: `Organization ${organization} does not exist.`
            }
        }
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

const deleteLocalUser = async (json) => {
    let {organization, username} = json
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
        if(docs.length>0){
            if (docs[0].localUsers.length != localUsers.length){
                docs[0].localUsers = localUsers
                for(let i=0;i<docs[0].felenetworks.length;i++){
                    for(let j=0;j<docs[0].felenetworks[i].feleChannel.length;j++){
                        let mappings = docs[0].felenetworks[i].feleChannel[j].mappings
                        mappings = mappings.filter((user) => {
                        return user.from !== username
                        })
                        docs[0].felenetworks[i].feleChannel[j].mappings = mappings
                    }
                }
                await updateDocument("fele__bid", docs[0])
                return{
                    message: `User ${username} deleted successfully.`
                }
            }
            else{
                return{
                    message: `User ${username} does not exists.`
                }
            }
        }else{
            return{
                message: `Organization ${organization} does not exist.`
            }
        }
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

const mapLocalUser = async(json) => {
    let {organization, fele_network, fele_channel, fele_user, username} = json
    try{
        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
        if(docs.length>0){
            let localUsers = docs[0].localUsers
            localUsers = localUsers.filter((user) => {
                return user.username == username
            })
            if (localUsers.length > 0){
                const f_index = docs[0].felenetworks.findIndex((network => network.felenetId == fele_network))
                if(f_index != -1){
                    let f_network = docs[0].felenetworks[f_index]
                    let f_channel = f_network.feleChannel
                    const c_index = f_channel.findIndex((channel => channel.channelName == fele_channel))
                    if(c_index != -1){
                        f_channel = f_network.feleChannel[c_index]
                        let f_users = f_channel.feleusers
                        const u_index = f_users.findIndex((users => users.feleuserId == fele_user))
                        if(u_index != -1){
                            let mappings = f_channel.mappings
                            const m_index = mappings.findIndex((map => map.from == username && map.to == fele_user))
                            if (m_index == -1){
                                mappings.push({"from":username,"to":fele_user})
                                f_channel.mappings = mappings
                                f_network.feleChannel[c_index] = f_channel
                                docs[0].felenetworks[f_index] = f_network
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
                            message: `Fele Channel ${fele_channel} does not exist.`
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
        }else{
            return{
                message: `Organization ${organization} does not exist.`
            }
        }
    } catch(error) {
        logger.error("Internal error: "+error)
    }
}

const deleteMapping = async(json) => {
    let {organization, fele_network, fele_channel, fele_user, username} = json
    try{
        let {docs} = await getDocumentFromDatabase("fele__bid", {
            selector: {
                organization: {
                    $eq: organization
                }
            }     
        })
        if(docs.length>0){
            let localUsers = docs[0].localUsers
            localUsers = localUsers.filter((user) => {
                return user.username == username
            })
            if (localUsers.length > 0){
                const f_index = docs[0].felenetworks.findIndex((network => network.felenetId == fele_network))
                if(f_index != -1){
                    let f_network = docs[0].felenetworks[f_index]
                    let f_channel = f_network.feleChannel
                    const c_index = f_channel.findIndex((channel => channel.channelName == fele_channel))
                    if(c_index != -1){
                        f_channel = f_network.feleChannel[c_index]
                        let f_users = f_channel.feleusers
                        const u_index = f_users.findIndex((users => users.feleuserId == fele_user))
                        if(u_index != -1){
                            let mappings = f_channel.mappings
                            const m_index = mappings.findIndex((map => map.from == username && map.to == fele_user))
                            if (m_index != -1){
                                console.log(mappings)
                                mappings = mappings.filter((map) => {
                                    return !(map.from === username && map.to === fele_user);
                                });
                                console.log(mappings)
                                f_channel.mappings = mappings
                                f_network.feleChannel[c_index] = f_channel
                                docs[0].felenetworks[f_index] = f_network
                                await updateDocument("fele__bid", docs[0])
                                return{
                                    message: `User ${username} mapped to Fele User ${fele_user} deleted successfully.`
                                }
                            }
                            else{
                                return{
                                    message: `No mapping exist between User ${username} and Fele User ${fele_user}.`
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
                            message: `Fele Channel ${fele_channel} does not exist.`
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
        }
        else{
            return{
                message: `Organization ${organization} does not exist.`
            }
        }
    }catch(error) {
        logger.error("Internal error: "+error)
    }
}

module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser,
    mapLocalUser,
    deleteMapping
}