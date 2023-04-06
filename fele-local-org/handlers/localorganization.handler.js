const localOrg = require('../LocalOrganization')
const logger = require('../../fele-client-service/utils/logger')

const registerLocalUser = (req, res) => {

}

const createOrganization = async (req, res) => {
    const {organization, localUsers} = req.body
    try {
        await localOrg.createOrganization(organization, localUsers)
        res.status(201).send({
            message: "Local organization created successfully"
        })
    } catch(error) {
        logger.error(error)
        res.status(500).send({
            message: error.message
        })
    }
    
}

const addLocalUser = async (req, res) => {
    const {username, password, role} = req.body
    const organization = req.header.organization
    if(organization) {
        try{
            await localOrg.addLocalUser(organization, username, password, role)
        } catch(error) {
            res.status(500).send({
                message: error
            })
        }
    } else {
        res.status(400).send({
            message: "Mandatory header 'organization'is missing in the request"
        })
    }

}

const updatePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const {organization, username} = req
    try {
        await localOrg.updatePassword(organization, username, oldPassword, newPassword)
        res.status(200).send({
            message: "Password updated successfully!"
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}

const deleteLocalUser = async (req, res) => {
    const {username} = req.body
    if(username == req.username) {
        res.status(500).send({
            message: "User(Admin) cannot delete himself"
        })
    } else{
        const organization = req.header.organization
        if(organization) {
            try{
                await localOrg.deleteLocalUser(organization, username)
            } catch(error) {
                logger.error(error)
                res.status(500).send({
                    message: error
                })
            }
        } else {
            res.status(400).send({
                message: "Mandatory header 'organization'is missing in the request"
            })
        }
    }
}

const getAllLocalUsers = async (req, res) => {

    try {
        const organization = req.headers.organization
        const localUsers = await localOrg.getAllLocalUsers(organization)
        res.status(200).send(localUsers)
    } catch(error) {
        logger.error(error)
        res.status(500).send({
            message: error
        })
    }
}

const getAllUserMappings = (req, res) => {

}

const addNewMapping = (req, res) => {

}

const deleteMappping = (req, res) => {

}

const getCurrentUserMapping = (req, res) => {

}

module.exports = {
    registerLocalUser,
    createOrganization,
    addLocalUser,
    updatePassword,
    deleteLocalUser,
    getAllLocalUsers,
    getAllUserMappings,
    addNewMapping,
    deleteMappping,
    getCurrentUserMapping
}