const { checkIfDatabaseExists, insertToDatabase, getDocumentFromDatabase, deleteDocument, updateDocument } = require('../../utils/db')
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')
const logger = require('../../utils/logger');
const { CHANNEL_ID_PREFIX, NETWORK_PREFIX, ORG_FMT } = require('../../utils/constants')
const { NETWORK_BASEPATH } = require('../../../globals')
const { getChannelSelector, getSelector } = require('../../utils/helpers');

const createChannel = async (networkName, channelConfig) => {
    const channelName = channelConfig.channelName
    const database = NETWORK_PREFIX + networkName;
    const timestamp = new Date().toISOString()
    channelConfig = {
        _id: CHANNEL_ID_PREFIX + uuidv4(),
        fmt: "channel",
        created_at: timestamp,
        updated_at: timestamp,
        ...channelConfig
    }

    const dbStatus = await checkIfDatabaseExists(database)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(database, getChannelSelector(channelName))
        if (docs.length > 0) {
            const errorMsg = `Document insert conflict: Channel with name ${channelName} already exists`
            logger.error(errorMsg)
            throw new Error(errorMsg)
        }

        const channelId = await insertToDatabase(database, channelConfig);
        logger.info(`channel with _id: ${channelId} created successfully in ${database} Network`)

        dir = path.join(NETWORK_BASEPATH, networkName, channelName)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        return {
            channelId,
            channelName,
            message: "Channel created successfully"
        }
    } else {
        const errorMsg = `Network ${networkName} not found`
        logger.error(errorMsg)
        throw new Error(errorMsg)
    }
}

const deleteChannel = async (networkName, channelName) => {
    networkName = NETWORK_PREFIX + networkName
    const dbStatus = await checkIfDatabaseExists(networkName)
    if (dbStatus) {
        const { docs } = await getDocumentFromDatabase(networkName, getChannelSelector(channelName))

        if (docs.length > 0) {
            const { _id, _rev } = docs[0]
            await deleteDocument(networkName, _id, _rev)
            return {
                message: "Channel deleted successfully"
            }
        }
        throw new Error(`Channel with name ${channelName} not found`)
    }
    throw new Error(`Network ${networkName} not found`)
}

const addFeleUsersInChannel = async (networkName, channelName, orgName, feleUsers) => {
    networkName = NETWORK_PREFIX + networkName
    const dbStatus = await checkIfDatabaseExists(networkName)
    if (!dbStatus) {
        throw new Error(`Network ${networkName} not found`)
    }

    const [{ docs: channelDocs = [] }, { docs: orgDocs = [] }] = await Promise.all([
        getDocumentFromDatabase(networkName, getChannelSelector(channelName)),
        getDocumentFromDatabase(networkName, getSelector(ORG_FMT, orgName))
    ])
    if(channelDocs.length == 0){
        throw new Error(`Channel ${channelName} does not exist.`)
    }
    if(orgDocs.length == 0){
        throw new Error(`Fele Organization ${orgName} does not exist.`)
    }
    const users = orgDocs[0]?.feleUsers?.map(({ feleUserId, publicKey }) => ({ feleUserId, publicKey })) ?? []
    const newFeleUsers = users.filter(user => feleUsers.includes(user.feleUserId))
    const notFeleUsers = feleUsers.filter(user => !newFeleUsers.some(({ feleUserId }) => feleUserId === user));
    if(notFeleUsers.length>0){
        logger.error(`The users who are not Fele Users: ${notFeleUsers.join(', ')}`)
        throw new Error(`The users who are not Fele Users: ${notFeleUsers.join(', ')}`)
    }
    const chOrg = channelDocs[0]?.organizations ?? []
    const chOrg_orgName = chOrg.filter(org => org.mspid == orgName)
    const chOrg_orgName_feleUsers = chOrg_orgName[0]?.feleUsers?.map(({ feleUserId }) => feleUserId.toString()) ?? [];
    const sameFeleUsers = newFeleUsers.filter(user => chOrg_orgName_feleUsers.includes(user.feleUserId));
    if (sameFeleUsers.length>0){
        logger.error(`Fele Users ${sameFeleUsers.map(user => user.feleUserId).join(', ')} already in channel`);
        throw new Error(`Fele Users ${sameFeleUsers.map(user => user.feleUserId).join(', ')} already in channel`)
    }
    const filteredNewFeleUsers = newFeleUsers.filter(user => !chOrg_orgName_feleUsers.includes(user.feleUserId));
    if(filteredNewFeleUsers.length>0){
        if (!chOrg_orgName[0].hasOwnProperty('feleUsers')) {
            chOrg_orgName[0].feleUsers = filteredNewFeleUsers;
        }else {
            chOrg_orgName[0].feleUsers.push(...filteredNewFeleUsers);
        }
        chOrg.filter(org => org.mspid == orgName)[0] = chOrg_orgName[0]
        channelDocs[0].organizations = chOrg
        await updateDocument(networkName,channelDocs[0])
        return {
            message: `Fele Users added successfully in channel. New users added: ${filteredNewFeleUsers.map(user => user.feleUserId).join(', ')}`
        }
    }else{
        return {
            message: `No Fele Users were added into channel.`
        }
    }
}

module.exports = {
    createChannel,
    deleteChannel,
    addFeleUsersInChannel
}