const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument} = require('../fele-client-service/utils/db')
const { v4: uuidv4 } = require('uuid')
const {LORG_ID_PREFIX, LORG_FMT, BID} = require('../fele-client-service/utils/constants')
const logger = require('../fele-client-service/utils/logger')
const {getSelector, selectorForLocalOrganization} = require('../fele-client-service/utils/helpers')

const createOrganization = async (organization, localUsers) => {
    //expected to receive encrypted passwords(local users) from client side
    const timestamp = new Date().toISOString()
    const organizationConfig = {
        _id: LORG_ID_PREFIX + uuidv4(),
        fmt: LORG_FMT,
        created_at: timestamp,
        updated_at: timestamp,
        organization,
        localUsers,
        feleNetworks: []
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

const addNetworkToLocalOrgConfig = async (networkName, organization, channels = []) => {
    const {docs} = await getDocumentFromDatabase(BID, selectorForLocalOrganization(organization))
    if(docs.length > 0) {
        const networkCheckIdx = docs[0].feleNetworks.findIndex((network => network.feleNetId == networkName))
        if(networkCheckIdx > -1) {
            throw new Error("Network exists in local org configuration")
        } else {
            let channelsArr = []
            if(channels.length > 0) {
                channels.forEach(channel => {
                    channelsArr.push({
                        channelName: channel.channelName,
                        feleUsers: [],
                        mappings: []
                    })
                })
            }
            docs[0].feleNetworks.push({
                feleNetId: networkName,
                feleOrgId: `${organization}_${networkName}`,
                feleChannels: channelsArr
            })
        }
        await updateDocument(BID, docs[0])
    } else {
        throw new Error("Error retrieving local organization information")
    }
}

const addLocalUser = async (organization, username, password, role) => {
    let docs = await getLocalOrgDoc(organization)
    let localUsers = docs[0].localUsers || []
    const userObj = localUsers.findIndex((user => user.username == username))
    if(userObj == -1) {
        localUsers.push({username, password, role})
        docs[0].localUsers = localUsers
        await updateDocument(BID, docs[0])
    } else {
        throw new Error(`User ${username} already exists.`)
    }
}

const deleteLocalUser = async (organization, username) => {
    const docs = await getLocalOrgDoc(organization)
    let localUsers = docs[0].localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(userObj == -1) {
        throw new Error("Local user not found")
    } else {
        localUsers = localUsers.filter((user) => {
            return user.username !== username
        })
    
        docs[0].localUsers = localUsers
        const feleNetworks = docs[0].feleNetworks
        const updatedFeleNetworks = await deleteAllUserMappings(feleNetworks, username)  
        docs[0].feleNetworks = updatedFeleNetworks
        await updateDocument(BID, docs[0])
        
    }
}

const deleteAllUserMappings = async (feleNetworks, username) => {
    
    feleNetworks = feleNetworks.map(network => {
        network.feleChannels = network.feleChannels.map(channel => {
            channel.mappings = channel.mappings.filter((mapping => mapping.from == username))
            return channel
        })
        return network
    })
    return feleNetworks 
}

const getAllLocalUsers = async (organization) => {
    const docs = await getLocalOrgDoc(organization)
    return docs[0].localUsers || []
}

const getLocalOrgDoc = async (organization) => {
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
    let docs = await getLocalOrgDoc(organization)
    let localUsers = docs[0].localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(localUsers[userObj].password == oldPassword){
        localUsers[userObj].password = newPassword
        docs[0].localUsers = localUsers
        await updateDocument(BID, docs[0])
    } else {
        throw new Error("Password doesn't match with the record")
    }
}

const addCertToWallet = async (feleUser, credentialId) => {
    const walletId = `wallet~${feleUser}`
    const {docs} = await getDocumentFromDatabase(BID, getSelector("_id", walletId))
    if(docs.length == 0) {
        await insertToDatabase(BID, {
            "_id": walletId,
            fmt: "wallet",
            credentials: [credentialId]
        })
    } else {
        docs[0].credentials.push(credentialId)
        await updateDocument(BID, docs[0])
    }
    return walletId
}

const addFeleUserToLOrg = async (organization, network, channel, feleUser) => {
    const localOrg = await getLocalOrgDoc(organization)
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId = network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName = channel))
        if(channelIdx > -1) {
            localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers.push({
                feleUserId: feleUser,
                walletId: "wallet~"+feleUser
            })
            await insertToDatabase(BID, localOrg)
        } else {
            throw new Error("Channel not found")
        }
    } else {
        throw new Error("Network not found in local organization")
    }
}

const getCurrentUserMapping = async (username, organization, network) => {
    const {docs} = await getDocumentFromDatabase(BID, selectorForLocalOrganization(organization))
    if(docs.length > 0) {
        const feleNet = docs[0].feleNetworks[network]
        if(feleNet) {
            const mappedIndex = feleNet.mappings.findIndex((mapping => mapping.from == username))
            let mapping = {}
            if(mappedIndex == -1) {
                mapping.mapped = false
                mapping.feleUser = ""
            } else {
                mapping.mapped = true
                mapping.feleUser = feleNet.mappings[mappedIndex].to
                mapping.walletId = feleNet.feleUsers.filter((user) => user.feleUserId == mapping.feleUser)[0].walletId
            }
            mapping.localUser = username
            return mapping
        }
        throw new Error("Network not found in local organization")
    }
    throw new Error("Local organization not found")
}

const getAllUserMappings = async (organization, network) => {
    const {docs} = await getDocumentFromDatabase(BID, selectorForLocalOrganization(organization))
    if(docs.length > 0) {
        const feleNet = docs[0].feleNetworks[network]
        if(feleNet) {
            const mappings =  feleNet.mappings.map((mapping)=> {
                return {
                    localUser: mapping.from,
                    feleUser: mapping.to,
                    walletId: feleNet.feleUsers.filter((user) => user.feleUserId == mapping.to)[0].walletId
                }
            })
            return mappings
        }
        throw new Error("Network not found in local organization")
    }
    throw new Error("Local organization not found")
}

const addNewMapping = async (organization, network, from, to) => {
    const {docs} = await getDocumentFromDatabase(BID, selectorForLocalOrganization(organization))
    if(docs.length > 0) {
        const feleNet = docs[0].feleNetworks[network]
        console.log(feleNet)
        if(feleNet) {
            checkIfLocalUserExist(docs[0].localUsers, from)
            checkIfFeleUserExist(feleNet.feleUsers, to)
            const mapIdx = feleNet.mappings.findIndex((mapping => mapping.from == from))
            if(mapIdx == -1) {
                docs[0].feleNetworks[network].mappings.push({from, to})
            } else {
                docs[0].feleNetworks[network].mappings[mapIdx].to = to
            }
            await updateDocument(BID, docs[0])
            return
        }
        throw new Error("Network not found in local organization")
    }
    throw new Error("Local organization not found")
}

const checkIfLocalUserExist = (localUsers, username) => {
    const idx = localUsers.findIndex((user => user.username == username))
    if(idx == -1) {
        throw new Error(`Local user ${username} not found`)
    }
}

const checkIfFeleUserExist = (feleUsers, username) => {
    const idx = feleUsers.findIndex((user => user.feleUserId == username))
    if(idx == -1) {
        throw new Error(`Fele user ${username} not found`)
    }
}

const deleteMappping = async (organization, network, username) => {
    const {docs} = await getDocumentFromDatabase(BID, selectorForLocalOrganization(organization))
    if(docs.length > 0) {
        const feleNet = docs[0].feleNetworks[network]
        if(feleNet) {
            const mappings = docs[0].feleNetworks[network].mappings
            let userObj = mappings.findIndex(mapping => mapping.from == username)
            if(userObj == -1) {
                throw new Error("Mapping not found")
            } else{
                const updatedMap = mappings.filter((mapping) => {
                    return mapping.from !== username
                })
                docs[0].feleNetworks[network].mappings = updatedMap
                await updateDocument(BID, docs[0])
                return
            }
        }
        throw new Error("Network not found in local organization")
    }
    throw new Error("Local organization not found")
}

module.exports = {
    createOrganization,
    addLocalUser,
    deleteLocalUser,
    getAllLocalUsers,
    updatePassword,
    addCertToWallet,
    addNetworkToLocalOrgConfig,
    getCurrentUserMapping,
    getAllUserMappings,
    addNewMapping,
    deleteMappping,
    addFeleUserToLOrg
}