const localOrg = require('../LocalOrganization')

const loginLocalUser = (req, res) => {

}

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
        res.status(500).send({
            message: error
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

const updateLocalUser = (req, res) => {

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

const getAllLocalUsers = (req, res) => {

}

const getAllUserMappings = (req, res) => {

}

const addNewMapping = (req, res) => {

}

const deleteMappping = (req, res) => {

}

const getCurrentUserMapping = (req, res) => {

}