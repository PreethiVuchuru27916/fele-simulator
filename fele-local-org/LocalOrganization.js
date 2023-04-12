const {createDatabase, insertToDatabase, getDocumentFromDatabase, updateDocument, listAllNetworks} = require('../fele-client-service/utils/db')
const { v4: uuidv4 } = require('uuid')
const {LORG_ID_PREFIX, LORG_FMT, BID, NETWORK_PREFIX} = require('../fele-client-service/utils/constants')
const logger = require('../fele-client-service/utils/logger')
const {getSelector, selectorForLocalOrganization} = require('../fele-client-service/utils/helpers')
const { forEach } = require('lodash')

let LOCAL_ORG = {}

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

const getChannelsInNetwork = async (network) => {
    const {docs} = await getDocumentFromDatabase("fele__"+network,  getSelector("fmt", "channel"))
    return docs.map(channel => channel.channelName)
}

const getChannelsAndItsFeleUsersInNetwork = async (network, organization) => {
    const {docs} = await getDocumentFromDatabase("fele__"+network,  getSelector("fmt", "channel"))
    
    const channels = docs.filter(channel => channel.organizations.findIndex(org => org.mspid == `${organization}_${network}`) > -1)
    console.log(channels)
    return channels.map(channel => {
        const orgIdx = channel.organizations.findIndex(org => org.mspid == `${organization}_${network}`)
        const feleUsers = channel.organizations[orgIdx].feleUsers.map(user => {
            return {
                feleUserId: user.feleUserId,
                walletId: `wallet~${user.feleUserId}`
            }
        })
        return {
            channelName: channel.channelName,
            feleUsers
        }
    })
}

const addNetworkToLocalOrgConfig = async (networkName, organization, doUpdate=true) => {
    let localOrg = {}
    if(doUpdate) {
        localOrg = await getLocalOrgDoc(organization)
    } else {
        localOrg = LOCAL_ORG
    }
    const networkCheckIdx = localOrg.feleNetworks.findIndex((network => network.feleNetId == networkName))
    if(networkCheckIdx > -1) {
        throw new Error("Network exists in local org configuration")
    } else {
        let channelsInfo = await getChannelsAndItsFeleUsersInNetwork(networkName, organization)
        console.log("channelInfo", channelsInfo)
        let channelsArr = []
        if(channelsInfo.length > 0) {
            channelsInfo.forEach(channelInfo => {
                channelsArr.push({
                    channelName: channelInfo.channelName,
                    feleUsers: channelInfo.feleUsers,
                    mappings: []
                })
            })
        }
        localOrg.feleNetworks.push({
            feleNetId: networkName,
            feleOrgId: `${organization}_${networkName}`,
            feleChannels: channelsArr
        })
    }
    if(doUpdate)
        await updateDocument(BID, localOrg)
    else return localOrg
}

const listAllNetworksinLocalOrg = async(organization) => {
    const localOrg = await getLocalOrgDoc(organization)
    return localOrg.feleNetworks.map(network => network.feleNetId)
}

const listAllChannelsInNetwork = async(organization, network) => {
    const localOrg = await getLocalOrgDoc(organization)
    const netIdx = localOrg.feleNetworks.findIndex(net => net.feleNetId == network)
    if(netIdx > -1) {
        const feleNet = localOrg.feleNetworks[netIdx]
        return feleNet.feleChannels.map(channel => channel.channelName)
    }
    throw new Error("Network not found")
}

const syncLocalOrg = async (organization) => {
    LOCAL_ORG = await getLocalOrgDoc(organization)
    const feleNetworks = await listAllNetworks()
    const localNetworks = LOCAL_ORG.feleNetworks.map(network => network.feleNetId)
    //Adding out ofsync networks
    const outOfSyncNetworks = feleNetworks.filter(network => localNetworks.indexOf(network) == -1)

    for(var i=0; i<outOfSyncNetworks.length; i++) {
        LOCAL_ORG = await addNetworkToLocalOrgConfig(outOfSyncNetworks[i], organization, false)
    }

    const inSyncNetworks = feleNetworks.filter(network => localNetworks.indexOf(network) > -1)
    console.log("inSync: ", inSyncNetworks)
    inSyncNetworks.map(async network => {
        const networkconfig = LOCAL_ORG.feleNetworks[LOCAL_ORG.feleNetworks.findIndex(net => net.feleNetId == network)]
        const localChannels = networkconfig.feleChannels.map(channel => channel.channelName)
        console.log("local channels: ", localChannels)
        const {docs} = await getDocumentFromDatabase(NETWORK_PREFIX+network, getSelector("fmt", "channel"))
        console.log(docs.length)
        docs.filter(channel => localChannels.indexOf(channel.channelName) == -1).map(async channel => {
            const org = channel.organizations
            console.log("orgs: ", org)
            LOCAL_ORG = await addChannelToNetwork(network, channel.channelName, organization, false)
            return
        })
    })
    await updateDocument(BID, LOCAL_ORG)
}

const addChannelToNetwork = async (network, channel, organization, doUpdate=true) => {
    let localOrg = {}
    if(doUpdate) {
        localOrg = await getLocalOrgDoc(organization)
    } else {
        localOrg = LOCAL_ORG
    }
    const netIdx = localOrg.feleNetworks.findIndex(net => net.feleNetId == network)
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex(chnl => chnl.channelName == channel)
        if(channelIdx > -1) {
            throw new Error("Channel Exists in the network.")
        } else {
            localOrg.feleNetworks[netIdx].feleChannels.push({
                channelName: channel,
                feleUsers: [],
                mappings: []
            })
            if(doUpdate)
                await updateDocument(BID, localOrg)
            else return localOrg
        }
    } else {
        throw new Error("Network not found in local organization")
    }
}

const addLocalUser = async (organization, username, password, role, userDetails = {}) => {
    let doc = await getLocalOrgDoc(organization)
    let localUsers = doc.localUsers || []
    const userObj = localUsers.findIndex((user => user.username == username))
    if(userObj == -1) {
        localUsers.push({username, password, role, personalDetails: userDetails})
        doc.localUsers = localUsers
        await updateDocument(BID, doc)
    } else {
        throw new Error(`User ${username} already exists.`)
    }
}

const deleteLocalUser = async (organization, username) => {
    const doc = await getLocalOrgDoc(organization)
    let localUsers = doc.localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(userObj == -1) {
        throw new Error("Local user not found")
    } else {
        localUsers = localUsers.filter((user) => {
            return user.username !== username
        })
    
        doc.localUsers = localUsers
        const feleNetworks = doc.feleNetworks
        const updatedFeleNetworks = await deleteAllUserMappings(feleNetworks, username)  
        doc.feleNetworks = updatedFeleNetworks
        await updateDocument(BID, doc)
        
    }
}

const deleteAllUserMappings = async (feleNetworks, username) => {
    
    feleNetworks = feleNetworks.map(network => {
        network.feleChannels = network.feleChannels.map(channel => {
            channel.mappings = channel.mappings.filter((mapping => mapping.from != username))
            return channel
        })
        return network
    })
    return feleNetworks 
}

const getAllLocalUsers = async (organization) => {
    const localOrg = await getLocalOrgDoc(organization)
    return localOrg.localUsers.map(user => {
        return {
            username: user.username,
            role: user.role
        }
    })
}

const getLocalOrgDoc = async (organization) => {
    const {docs} = await getDocumentFromDatabase(BID, {
        selector: {
            organization: {
                $eq: organization
            }
        }     
    })
    if(docs.length > 0) return docs[0] 
    else throw new Error("Local organization not found")
}

const updatePassword = async (organization, username, oldPassword, newPassword) => {
    let doc = await getLocalOrgDoc(organization)
    let localUsers = doc.localUsers || []
    let userObj = localUsers.findIndex((user => user.username == username))
    if(localUsers[userObj].password == oldPassword){
        localUsers[userObj].password = newPassword
        doc.localUsers = localUsers
        await updateDocument(BID, doc)
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
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId == network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName == channel))
        if(channelIdx > -1) {
            let userObj = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers.findIndex(user => user.feleUserId == feleUser)
            if(userObj == -1) {
                 localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers.push({
                    feleUserId: feleUser,
                    walletId: "wallet~"+feleUser
                    })
                await updateDocument(BID, localOrg)
                return
            } else {
                throw new Error("Fele User already Exists")
            }
        } else {
            throw new Error("Channel not found")
        }
    } else {
        throw new Error("Network not found in local organization")
    }
}

const getCurrentUserMapping = async (username, organization, network, channel) => {
    const localOrg = await getLocalOrgDoc(organization)
    checkIfLocalUserExist(localOrg.localUsers, username)
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId == network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName == channel))
        if(channelIdx > -1) {
            const mappedIndex = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings.findIndex((mapping => mapping.from == username))
            let mapping = {}
            if(mappedIndex == -1) {
                mapping.mapped = false
                mapping.feleUser = ""
            } else {
                mapping.mapped = true
                mapping.feleUser = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings[mappedIndex].to
                mapping.walletId = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers.filter((user) => user.feleUserId == mapping.feleUser)[0].walletId
            }
            mapping.localUser = username
            return mapping
        }
        throw new Error("Network not found in local organization")
    }
    throw new Error("Local organization not found")
}


const getAllUserMappings = async (organization, network, channel) => {
    const localOrg = await getLocalOrgDoc(organization)
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId == network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName == channel))
        if(channelIdx > -1) {
            const mappings =  localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings.map((mapping)=> {
                return {
                    localUser: mapping.from,
                    feleUser: mapping.to,
                    walletId: localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers.filter((user) => user.feleUserId == mapping.to)[0].walletId
                }
            })
            return mappings
        }
        throw new Error("Channel not found")
    }
    throw new Error("Network not found in local organization")
}


const addNewMapping = async (organization, network, channel, from, to) => {
    const localOrg = await getLocalOrgDoc(organization)
    checkIfLocalUserExist(localOrg.localUsers, from)
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId == network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName == channel))
        if(channelIdx > -1) {
            checkIfFeleUserExist(localOrg.feleNetworks[netIdx].feleChannels[channelIdx].feleUsers, to)
            let userObj = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings.findIndex(map => {
                return map.from == from && map.to == to
            })
            if(userObj == -1) {
                localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings.push({from,to})
                await updateDocument(BID, localOrg)
                return
            } else {
                throw new Error("Mapping already exists")
            }
        } else {
            throw new Error("Channel not found")
        }
    } else {
        throw new Error("Network not found in local organization")
    }
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


const deleteMapping = async (organization, network, username, channel) => {
    const localOrg = await getLocalOrgDoc(organization)
    const netIdx = localOrg.feleNetworks.findIndex((net => net.feleNetId = network))
    if(netIdx > -1) {
        const channelIdx = localOrg.feleNetworks[netIdx].feleChannels.findIndex((chnl => chnl.channelName = channel))
        if(channelIdx > -1) {
            const mappings = localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings
            let userObj = mappings.findIndex(mapping => mapping.from == username)
            if(userObj == -1) {
                throw new Error("Mapping not found")
            } else{
                const updatedMap = mappings.filter((mapping) => {
                    return mapping.from !== username
                })
                localOrg.feleNetworks[netIdx].feleChannels[channelIdx].mappings = updatedMap
                await updateDocument(BID, localOrg)
                return
            }
        }
        throw new Error("Channel not found")
    }
    throw new Error("Network not found in local organization")
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
    deleteMapping,
    addFeleUserToLOrg,
    addChannelToNetwork,
    syncLocalOrg,
    listAllChannelsInNetwork,
    listAllNetworksinLocalOrg
}